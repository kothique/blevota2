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
  resolve: {
    alias: {
      ['@common']: resolve(__dirname, 'common'),
      ['@server']: resolve(__dirname, 'server'),
      ['@client']: resolve(__dirname, 'client')
    }
  },
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
        loader: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: false
            }
          }
        ]
      },
      {
        test: /\.styl$/,
        exclude: resolve(__dirname, 'node_modules'),
        loader: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: false
            }
          },
          'stylus-loader'
        ]
      }
    ]
  },
  devtool: 'source-map'
}
