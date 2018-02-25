const { resolve } = require('path')

module.exports = {
  testMatch: [
    '**/__tests__/**/*.js',
    resolve(__dirname, 'tests/**/*.js')
  ]
}