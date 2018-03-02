const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const config = require('../server.config')

module.exports = () => {
  const { host,  port,
          username, password } = config.db

  let uri = 'mongodb://'
  if (username) {
    uri += `${username}:${password}@`
  }
  uri += `${host}:${port}/blevota2`

  return mongoose.connect(uri, {
    useMongoClient: true
  })
}