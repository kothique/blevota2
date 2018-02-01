const mongoose = require('mongoose')
const cluster = require('cluster')

const port = process.env.MONGO_PORT || 27017

module.exports = (onOpen) => {
  mongoose.connect(`mongodb://localhost:${port}/blevota2`, {
    useMongoClient: true
  })
  mongoose.Promise = global.Promise

  let db = mongoose.connection

  db.on('error', (err) => {
    console.log(err.message)
  })

  db.once('open', () => {
    if (cluster.isMaster) {
      console.log(`Successfully connected to MongoDB server`)
    }

    onOpen()
  })
}