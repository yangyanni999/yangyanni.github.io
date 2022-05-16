const path = require('path')
const fs = require('fs')
const ejs = require('ejs')
//解析AST语法树
const parser = require('@babel/parser')
//修改AST
const traverse = require('@babel/traverse').default
//将AST转换为代码
const generator = require('@babel/generator').default

class Compiler {
  constructor(config) {
    this.config = config
    [this.entry] = [...config]
    //执行打包的工作目录
    this.root = process.cwd()
    this.modules={}
  }

  /* 依赖分析 */
  depAnalysis(modulePath, relativePath) {
    let self = this

    //1、读取代码
    let source = fs.readFileSync(modulePath, 'utf-8')

    //2、声明依赖数组
    let dependencies = []

    //3、当代码转为AST语法树
    let ast = parser.parse(source)

    //4、修改语法树
    traverse(ast, {
      CallExpression(nodeLiterator) {
        if (nodeLiterator.node.callee.name == 'require') {
          nodeLiterator.node.callee.name = '_webpack_require_'
          //提取路径
          nodeLiterator.node.arguments[0].value = './' + path.join('src', nodeLiterator.node.arguments[0].value)
          nodeLiterator.node.arguments[0].value=nodeLiterator.node.arguments[0].value.replace(/\\+/g,'/')
          //存入依赖数组
          dependencies.push(nodeLiterator.node.arguments[0].value)
        }
      }
    })

    //5、转为代码
    let resultSourceCode = generator(ast).code

    //6、获取相对路径
    let modulePathRelative=this.replaceSlash
  }
}