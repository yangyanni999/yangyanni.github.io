const { declare } = require('@babel/helper-plugin-utils')

const autoTrackPlugin = declare((api,options,dirname) => {
  api.assertVersion(7)
  return {
    pre
  }
})
