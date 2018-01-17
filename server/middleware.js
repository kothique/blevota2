const session = require('express-session')
const auth = require('./auth')
const bodyParser = require('body-parser')

module.exports = (app) => {
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(session({
    secret: 'my wonderful secret',
    resave: false,
    saveUninitialized: false
  }))
  app.use(auth.middleware())
}