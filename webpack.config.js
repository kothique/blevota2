const CopyWebpackPlugin = require('copy-webpack-plugin')
const { resolve } = require('path')

module.exports = {
  entry: './client/index.js',
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: './client/index.html', to: './index.html' },
      { from: './client/images/', to: './images/' }
    ])
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: resolve(__dirname, 'node_modules'),
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        exclude: resolve(__dirname, 'node_modules'),
        loader: ['style-loader', 'css-loader']
      }
    ]
  }
}
