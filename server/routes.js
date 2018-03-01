const forIn = require('lodash/forIn')
const map = require('lodash/map')
const { resolve } = require('path')

const { createUser } = require('./auth')
const { login, ifUser, ifGuest, AuthError } = require('./auth')
const RegionManager = require('./region-manager')

module.exports = (app) => {
  app.post('/api/login', ifUser({ error: true }), (req, res) => {
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

    login(username, password).then((user) => {
      res.status(202).sendJWT(user)
    }, (err) => {
      if (err instanceof AuthError) {
        res.status(403).send({ error: err.message })
      } else {
        res.status(500).end()
      }
    })
  })

  app.post('/api/register', ifUser({ error: true }), (req, res) => {
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

  app.get('/api/regions', ifGuest({ error: true }), (req, res) => {
    let response = []
    forIn(RegionManager.regions, (region, name) => {
      response.push({
        name,
        players: map(region.players, (player) => ({
          id: player.id,
          username: player.username
        }))
      })
    })

    res.send({ regions: response })
  })

  app.get('/*', (req, res) => {
    res.sendFile(resolve(__dirname, '../dist/index.html'))
  })
}