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
      {test:'/\.css$/',use:'index.css'}
    ]
  },
  // plugins: [
  //   new HtmlWebpackPlugin({template:'./preview.html'})//指定预浏览页面
  // ]
}