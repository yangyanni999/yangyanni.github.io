const { declare } = require('@babel/helper-plugin-utils')
const fse = require('fs-extra');
const path = require('path');
const generate = require('@babel/generator').default;

let intlIndex = 0;
function nextIntlKey() {
    ++intlIndex;
    return `intl${intlIndex}`;
}

const autoTrackPlugin = declare((api,options,dirname) => {
  api.assertVersion(7)
  if (!options.outputDir) {
    throw new Error('outputDir in empty');
}
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
          let key = nextIntlKey();
                save(state.file, key, path.node.value)
                const replaceExpression = getReplaceExpression(path, key, state.intlUid);
                path.replaceWith(replaceExpression);
                path.skip();
        },
        TemplateLiteral(path, state) {
          if (path.node.skipTransform) {
            return;
          }
          const value = path.get('quasis').map(item => item.node.value.raw).join('{placeholder}');
                if(value) {
                    let key = nextIntlKey();
                    save(state.file, key, value);

                    const replaceExpression = getReplaceExpression(path, key, state.intlUid);
                    path.replaceWith(replaceExpression);
                    path.skip();
                }
        }
      }
    },
    post(file) {
      const allText = file.get('allText');
      const intlData = allText.reduce((obj, item) => {
          obj[item.key] = item.value;
          return obj;
      }, {});

      const content = `const resource = ${JSON.stringify(intlData, null, 4)};\nexport default resource;`;
      fse.ensureDirSync(options.outputDir);
      fse.writeFileSync(path.join(options.outputDir, 'zh_CN.js'), content);
      fse.writeFileSync(path.join(options.outputDir, 'en_US.js'), content);
    }
  }
})

module.exports=autoTrackPlugin