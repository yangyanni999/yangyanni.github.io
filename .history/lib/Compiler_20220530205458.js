const path = require('path')
const fs = require('fs')
const ejs = require('ejs')
const { SyncHook } = require('tapable')
//解析AST语法树
const parser = require('@babel/parser')
//修改AST
const traverse = require('@babel/traverse').default
//将AST转换为代码
const { transformFromAst } = require('@babel/core')
class Compiler {




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
