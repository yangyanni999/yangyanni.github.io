module.exports = class demoPlugins {
  // apply方法
  apply(compiler) {
   // 指定一个（这个插件中为多个）绑定到 webpack 自身的事件钩子。
   // 订阅 start 钩子
    compiler.hooks.start.tap('demoPlugin', () => {
      console.log('webpack开始编译')
    });

    // 订阅 compile 钩子
    compiler.hooks.compile.tap('demoPlugin', () => {
      console.log('编译中')
    });

    // 订阅 afterCompile 钩子
    compiler.hooks.afterCompile.tap('demoPlugin', () => {
      console.log('webpack编译结束')
    });

    // 订阅 emit 钩子
    compiler.hooks.emit.tap('demoPlugin', (filename) => {
      console.log('开始打包文件，文件名为： ', filename)
    });

    // 订阅 afterEmit 钩子
    compiler.hooks.afterEmit.tap('demoPlugin', (path) => {
      console.log('文件打包结束，打包后文件路径为： ', path)
    });

    // 订阅 done 钩子
    compiler.hooks.done.tap('demoPlugin', () => {
      console.log('webpack打包结束')
    })
  }
}