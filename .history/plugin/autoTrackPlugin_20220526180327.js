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
            },
          })
          //如果没有引入
          if (!imported) {
            const uid = path.scope.generateUid('intl')
            const importAst = api.template.ast(`import ${uid} from intl`)
            path.node.body.unshift(importAst)
            state.intlUid=uid
          }
          path.traverse({
            'StringLiteral|TemplateLiteral'(path) {
              if (path.node.leadingComments) {
                path.node.leadingComments = path.node.leadingComments.filter((item, index) => {
                  if (item.value.includes('i18n-disable')) {
                    path.node.skipTransform = true;
                    return false;
                  }
                  return true
                })
              }
              if(path.findParent(p => p.isImportDeclaration())) {
                path.node.skipTransform = true;
            }
            }
          })
        },
        StringLiteral(path, state) {
          if (path.node.skipTransform) {
            return
          }

        }
      }
    },
    post(file){}
  }
})

module.exports=autoTrackPlugin