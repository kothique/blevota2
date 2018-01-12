const mongoose = require('mongoose')

const User = require('./db/user')

mongoose.connect('mongodb://localhost:27017/blevota2', {
  useMongoClient: true
})
mongoose.Promise = global.Promise

let db = mongoose.connection

db.on('error', () => {
  console.log('Failed to connect to MongoDB server')
})

db.once('open', async () => {
  console.log('Successfully connected to MongoDB server')

  let app = require('express')()

  app.listen(3000, () => {
    console.log('Server is listening on port 3000')
  })
})