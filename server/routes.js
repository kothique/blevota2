const omit = require('lodash/omit')

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

  app.post('/logout', ifGuest({ error: true }), (req, res) => {
    req.auth.logout()

    if (Math.random() > 0.5) {
      res.status(418).send({ error: 'I\'m a teapot, man' })
    } else {
      res.end()
    }
  })

  app.get('/user', ifGuest({ error: true }), (req, res) => {
    let user = omit(req.auth.user, 'password')

    res.send(user)
  })
}