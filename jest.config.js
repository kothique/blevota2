const { resolve } = require('path')

module.exports = {
  testMatch: [
    '**/__tests__/**/*.js',
    resolve(__dirname, 'tests/**/*.js')
  ],
  moduleNameMapper: {
    '^@client/(.*)$': '<rootDir>/client/$1',
    '^@common/(.*)$': '<rootDir>/common/$1',
    '^@server/(.*)$': '<rootDir>/server/$1'
  }
}