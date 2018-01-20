const pick = require('lodash/pick')
const { createUser } = require('./auth')

const { ifUser, ifGuest, AuthError } = require('./auth')

module.exports = (app) => {
  app.post('/login', ifUser({ error: true }), (req, res) => {
    let username = req.body.username,
        password = req.body.password

    if (!username) {
      res.status(400).send({ error: 'Username can\'t be empty' })
      return
    }

    if (!password) {
      res.status(400).send({ error: 'Password can\'t be empty' })
      return
    }

    req.auth.login(username, password).then(() => {
      res.status(202).end()
    }, (err) => {
      if (err instanceof AuthError) {
        res.status(403).send({ error: err.message })
      } else {
        res.status(500).end()
      }
    })
  })

  app.post('/register', ifUser({ error: true }), (req, res) => {
    let username = req.body.username,
        password = req.body.password

    if (!username) {
      res.status(400).send({ error: 'Username can\'t be empty' })
      return
    }

    if (!password) {
      res.status(400).send({ error: 'Password can\'t be empty' })
      return
    }

    createUser(username, password).then(() => {
      res.status(201).end()
    }, (err) => {
      if (err instanceof AuthError) {
        res.status(403).send({ error: err.message })
      } else {
        res.status(500).end()
      }
    })
  })

  app.post('/logout', ifGuest({ error: true }), (req, res) => {
    req.auth.logout()

    res.send({})
  })

  app.get('/user', ifGuest({ error: true }), (req, res) => {
    let user = pick(req.auth.user, [
      'username'
    ])

    res.send(user)
  })
}