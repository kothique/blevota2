const mongoose = require('mongoose')
const escape = require('lodash/escape')
const session = require('express-session')

const auth = require('./auth')

const port = process.env.PORT || 3001

const mongoPort = process.env.MONGO_PORT || 27017

mongoose.connect(`mongodb://localhost:${mongoPort}/blevota2`, {
  useMongoClient: true
})
mongoose.Promise = global.Promise

let db = mongoose.connection

db.on('error', (err) => {
  console.log(err.stack)
})

db.once('open', () => {
  console.log(`Successfully connected to MongoDB server`)

  let app = require('express')(),
      expressWs = require('express-ws')(app)

  let sessionParser = session({
    secret: 'my wonderful secret',
    resave: false,
    saveUninitialized: false
  })

  require('./middleware')(app, sessionParser)
  require('./websocket')(app, expressWs.getWss(), sessionParser)
  require('./routes')(app)

  app.listen(3001, () => {
    console.log(`Server is listening on port ${port}`)
  })
})
