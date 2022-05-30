const fs = require("fs");
const path = require("path");
const Parser = require("./Parser");
class Compiler {
  constructor(options) {
    const { entry, output } = options;
    this.entry = entry;
    this.output = output;
    this.modules = [];
  }
  // 构建启动
  run() {
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
    this.generate(dependencyGraph);
  }
  build(filename) {
    const { getAst, getDependecies, getCode } = Parser;
    const ast = getAst(filename);
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
    fs.writeFileSync(filePath, bundle, "utf-8");
  }
}

module.exports = Compiler;



class Compiler {
  constructor(config) {
    this.config = config
    this.entry = config.entry
    this.output = config.output
    //执行打包的工作目录
    this.root = process.cwd()
    this.modules = {}
    this.hooks = {
      start: new SyncHook(),
      compile: new SyncHook(['relativePath']),
      afterCompile: new SyncHook(),
      emit: new SyncHook(['filename']),
      afterEmit: new SyncHook(['outputPath']),
      done: new SyncHook()
    }
    if (Array.isArray(this.config.plugins)) {
      this.config.plugins.forEach((item) => {
        item.apply(this)
      })
    }
  }

  /* -------依赖分析------ */
  depAnalysis(modulePath, relativePath) {
    let self = this
    this.hooks.compile.call(relativePath)
    //1、读取代码
    let source = fs.readFileSync(modulePath, 'utf-8')

    //代码经过loader迭代编译
    source = this.loaderCompiler(source, modulePath)

    //2、声明依赖数组
    let dependencies = []

    //3、当代码转为AST语法树
    let ast = parser.parse(source, {
      sourceType: 'module'
    })

    //4、修改语法树
    traverse(ast, {
      CallExpression(nodeLiterator) {
        if (nodeLiterator.node.callee.name == 'require') {
          nodeLiterator.node.callee.name = '_webpack_require_'
          //提取路径
          nodeLiterator.node.arguments[0].value =
            nodeLiterator.node.arguments[0].value
          nodeLiterator.node.arguments[0].value =
            nodeLiterator.node.arguments[0].value.replace(/\\+/g, '/')
          //存入依赖数组
          dependencies.push(nodeLiterator.node.arguments[0].value)
        }
      },
      ImportDeclaration({ node }) {
        dependencies.push(node.source.value)
      }
    })

    //5、转为代码

    let resultSourceCode = transformFromAst(ast, null, {
      presets: ['@babel/preset-env']
    }).code

    //6、获取相对路径 处理分斜杠
    let modulePathRelative =
      './' + path.relative(this.root, modulePath).replace(/\\+/g, '/')

    //7、 存入到modules中
    this.modules[modulePathRelative] = resultSourceCode

    //8、遍历依赖
    dependencies.forEach((dep) => {
      return this.depAnalysis(path.resolve(this.root, dep), dep)
    })
  }

  /*-------loader编译---------*/
  loaderCompiler(source, modulePath) {
    let root = this.root
    //递归遍历函数
    function compilation(use, optionObj) {
      let loaderPath = path.join(root, use)
      let loader = require(loaderPath)
      source = loader.call(optionObj, source, optionObj)
      return source
    }
    for (let i = 0; i < this.config.module.rules.length; i++) {
      let { test, use } = this.config.module.rules[i]
      if (test.test(modulePath)) {
        if (Array.isArray(use)) {
          //从右向左，从下到上遍历
          for (let j = use.length - 1; j >= 0; j--) {
            return compilation(use[j])
          }
        } else if (typeof use == 'string') {
          return compilation(use)
        } else if (use instanceof Object) {
          return compilation(use.loader, { query: use.options })
        }
      }
    }
  }

  /* --------执行代码进行打包---------*/
  emitFile() {
    const templatePath = path.join(__dirname, '../template/output.ejs')
    let template = fs.readFileSync(templatePath, 'utf-8')
    //模板渲染拼接
    let result = ejs.render(template, { entry: this.entry, modules: this.modules })


    //配置输出文件
    let outputPath = path.join(this.output.path, this.output.filename)
    this.hooks.emit.call(this.output.filename)
    fs.writeFileSync(outputPath, result)
    this.hooks.afterEmit.call(this.output.path)
  }

  start() {
    this.hooks.start.call()
    this.depAnalysis(path.resolve(this.root, this.entry), this.entry)
    this.hooks.afterCompile.call()
    this.emitFile()
    this.hooks.done.call()
  }
}

module.exports = Compiler
