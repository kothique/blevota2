const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const session = require('express-session')
const _ = require('lodash')

const auth = require('./auth')
const User = require('./db/user')

mongoose.connect('mongodb://localhost:27017/blevota2', {
  useMongoClient: true
})
mongoose.Promise = global.Promise

let db = mongoose.connection

db.on('error', () => {
  console.log('Failed to connect to MongoDB server')
})

db.once('open', () => {
  console.log('Successfully connected to MongoDB server')

  let app = require('express')()

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(session({
    secret: 'my wonderful secret',
    resave: false,
    saveUninitialized: false
  }))
  app.use(auth.middleware())

  app.get('/', (req, res) => {
    if (req.auth.user) {
      const user = req.auth.user

      let body = `Hi, ${_.escape(user.username)}!`

      res.send(body)
    } else {
      res.send('Unauthorized<br /><small>Go to /login</small>')
    }
  })

  app.get('/login', (req, res) => {
    let username = req.query.u || '',
        password = req.query.p || ''

    req.auth.login(username, password).then(() => {
      res.redirect('/')
    }, err => {
      if (err instanceof auth.AuthError) {
        res.status(401).send(err.message)
      } else {
        res.status(500).end()
      }
    })
  })

  app.get('/logout', (req, res) => {
    req.auth.logout()
    res.redirect('/')
  })

  /*app.get('/bootstrap', async (req, res) => {
    await auth.createUser('kothique', 'pass')

    res.redirect('/')
  })*/

  app.listen(3000, () => {
    console.log('Server is listening on port 3000')
  })
})