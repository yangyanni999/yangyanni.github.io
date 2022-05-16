const config = {
  entry: './index.js',
  output: {
    filename: 'bundle.js',
    path:'./bin'
  },
  mode: 'development',
  module: {
    rules: [
      {test:'/\.css/'}
     ]
  }
}