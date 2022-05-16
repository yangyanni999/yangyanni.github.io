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

}