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
      CallExpression(p)
    })
  }
}