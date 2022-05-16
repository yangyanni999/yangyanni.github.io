const config = {
  entry: './index.js',
  output: {
    filename: 'bundle.js',
    path:'./bin'
  },
  mode: 'development',
  module: {
    rules: [
      {test:'/\.css$/',use:'css-loader'}
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({template:'./preview.html'})//指定预浏览页面
  ]
}