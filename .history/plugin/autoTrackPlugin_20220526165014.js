const { declare } = require('@babel/helper-plugin-utils')

const autoTrackPlugin = declare((api,options,dirname) => {
  api.assertVersion(7)
  return {
    pre(file) { },
    visitor: {
      Program: {
        enter(path, state) {
          let imported
          path.traverse({
            ImportDeclaration(p) {
              const source = p.node.source.value
              if (source == 'intl') {
                imported = true
              }
            }
          });

          //如果没有引入
          if (!imported) {
            import uid= path.scope.generate
          }
        }
      }
    },
    post(file){}
  }
})

module.exports=autoTrackPlugin