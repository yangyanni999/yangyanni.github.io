const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const { transformFromAst } = require("@babel/core");
const Parser = {
  getAst: (path,options) => {
    const content = fs.readFileSync(path, "utf-8");

    //loader编译
    content=loaderCompiler(content,path,options)
    return parser.parse(content, {
      sourceType: "module"
    });
  },
  getDependecies: (ast, filename) => {
    const dependecies = {};
    traverse(ast, {
      ImportDeclaration({ node }) {
        const dirname = path.dirname(filename);
        const filepath = "./" + path.join(dirname, node.source.value);
        dependecies[node.source.value] = filepath;
      }
    });
    return dependecies;
  },
  getCode: ast => {
    const { code } = transformFromAst(ast, null, {
      presets: ["@babel/preset-env"]
    });
    return code;
  },

};
/*-------loader编译---------*/
function loaderCompiler(source, modulePath,options){
  let root = this.root
  //递归遍历函数
  function compilation(use, optionObj) {
    let loaderPath = path.join(root, use)
    let loader = require(loaderPath)
    source = loader.call(optionObj, source, optionObj)
    return source
  }
  for (let i = 0; i < options.module.rules.length; i++) {
    let { test, use } = options.module.rules[i]
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
module.exports = Parser;