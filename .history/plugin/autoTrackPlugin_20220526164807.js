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
              const sourse = p.node.source.value
              if(sourse=='')
              }
          })
        }
      }
    },
    post(file){}
  }
})

module.exports=autoTrackPlugin