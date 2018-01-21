const mongoose = require('mongoose')
const escape = require('lodash/escape')

const auth = require('./auth')

mongoose.connect('mongodb://localhost:27017/blevota2', {
  useMongoClient: true
})
mongoose.Promise = global.Promise

let db = mongoose.connection

db.on('error', (err) => {
  console.log(err.stack)
})

db.once('open', () => {
  console.log('Successfully connected to MongoDB server')

  let app = require('express')(),
      expressWs = require('express-ws')(app)

  require('./middleware')(app)
  require('./routes')(app)
  require('./websocket')(app, expressWs.getWss())

  app.listen(3001, () => {
    console.log('Server is listening on port 3001')
  })
})
