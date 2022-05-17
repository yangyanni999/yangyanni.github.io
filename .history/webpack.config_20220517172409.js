const path = require('path')
const demoPlugin = require('./plugins/demoPlugin')
module.exports = {
  entry:  [
    "core-js/modules/es6.promise",
    "core-js/modules/es6.array.iterator",
    path.resolve(__dirname, "index.js"),
  ],
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist')
  },
  mode: 'development',
  module: {
    rules: [
      // { test: '/\.js$/', use: './loaders/loader.js' },
      {
        test:/\.js$/, use: {
          loader: './loaders/loader.js',
          options: {
            name:'jsLoader1'
          }
        }
      }
    ]
  },
  plugins: [
    new demoPlugin()
  ]
}