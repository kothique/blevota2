const { resolve } = require('path')

module.exports = {
  source: {
    include: [
      'client', 'server', 'common'
    ],
    exclude: [
      'node_modules'
    ]
  },
  opts: {
    destination: './docs',
    recurse: true
  }
}
