const fs = require("fs");
const path = require("path");
const { SyncHook } = require('tapable')
const Parser = require("./Parser");
class Compiler {
  constructor(options) {
    const { entry, output } = options;
    this.options=options
    this.entry = entry;
    this.output = output;
    this.modules = [];
    this.hooks = {
      start: new SyncHook(),
      compile: new SyncHook(['relativePath']),
      afterCompile: new SyncHook(),
      emit: new SyncHook(['filename']),
      afterEmit: new SyncHook(['outputPath']),
      done: new SyncHook()
    }
    if (Array.isArray(options.plugins)) {
      options.plugins.forEach((item) => {
        item.apply(this)
      })
    }
  }
  // 构建启动
  run() {
    this.hooks.start.call()
    const info = this.build(this.entry);
    this.modules.push(info);
    this.modules.forEach(({ dependecies }) => {
      if (dependecies) {
        for (const dependency in dependecies) {
          this.modules.push(this.build(dependecies[dependency]));
        }
      }
    });
    const dependencyGraph = this.modules.reduce(
      (graph, item) => ({
        ...graph,
        [item.filename]: {
          dependecies: item.dependecies,
          code: item.code
        }
      }),
      {}
    );
    this.hooks.afterCompile.call()
    this.generate(dependencyGraph);
    this.hooks.done.call()
  }
  build(filename) {
    const { getAst, getDependecies, getCode } = Parser;
    const ast = getAst(filename,this.options);
    const dependecies = getDependecies(ast, filename);
    const code = getCode(ast);
    return {
      filename,
      dependecies,
      code
    };
  }
  generate(code) {
    const filePath = path.join(this.output.path, this.output.filename);
    const bundle = `(function(graph){
      function require(moduleId){
        function localRequire(relativePath){
          return require(graph[moduleId].dependecies[relativePath])
        }
        var exports = {};
        (function(require,exports,code){
          eval(code)
        })(localRequire,exports,graph[moduleId].code);
        return exports;
      }
      require('${this.entry}')
    })(${JSON.stringify(code)})`;
    this.hooks.emit.call(this.output.filename)
    fs.writeFileSync(filePath, bundle, "utf-8");
    this.hooks.afterEmit.call(this.output.path)
  }
}

module.exports = Compiler;




