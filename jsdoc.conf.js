const { resolve } = require('path')

module.exports = {
  source: {
    include: [
      'client', 'server', 'common'
    ],
    exclude: [
      'node_modules', 'client/public'
    ]
  },
  opts: {
    destination: './docs',
    recurse: true
  }
}