const path = require('path')
module.exports= {
  entry: './index.js',
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
    new demoPlugin('./plugins/demo.js')
  ]
}