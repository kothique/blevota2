const path = require('path')

module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'client'),
    filename: 'public/bundle.js'
  },
  context: path.resolve(__dirname, 'client'),
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: path.resolve(__dirname, 'node_modules'),
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        exclude: path.resolve(__dirname, 'node_modules'),
        loader: ['style-loader', 'css-loader']
      }
    ]
  },
  watchOptions: {

  }
}
