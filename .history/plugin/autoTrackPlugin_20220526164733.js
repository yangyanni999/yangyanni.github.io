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
              const course=p.node.source.value
              }
          })
        }
      }
    },
    post(file){}
  }
})

module.exports=autoTrackPlugin