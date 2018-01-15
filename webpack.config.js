const path = require('path')

module.exports = [
  // client
  {
    entry: './index.js',
    output: {
      path: path.resolve(__dirname, 'client'),
      filename: 'bundle.js'
    },
    context: path.resolve(__dirname, 'client'),
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: path.resolve(__dirname, 'node_modules'),
          loader: 'babel-loader'
        }
      ]
    },
    plugins: [
      
    ]
  }
]