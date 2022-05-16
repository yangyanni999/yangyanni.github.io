const path = require('path')
const fs = require('fs')
const ejs = require('ejs')
//解析AST语法树
const parser = require('@babel/parser')
//修改AST
const traverse = require('@babel/traverse').default
//将AST转换为代码
const generator = require('@babel/generator').default

