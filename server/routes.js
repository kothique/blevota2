const { ifUser, ifGuest, AuthError } = require('./auth')

module.exports = app => {
  app.get('/', (req, res) => {
    if (req.auth.user) {
      const user = req.auth.user

      let body = `Hi, ${escape(user.username)}!`

      res.send(body)
    } else {
      res.send('Unauthorized<br /><small>Go to /login</small>')
    }
  })

  app.get('/login', ifUser({ redirect: '/' }), (req, res) => {
    let username = req.query.u || '',
        password = req.query.p || ''

    req.auth.login(username, password).then(() => {
      res.redirect('/')
    }, err => {
      if (err instanceof AuthError) {
        res.status(401).send(err.message)
      } else {
        res.status(500).end()
      }
    })
  })

  app.get('/logout', ifGuest({ redirect: '/' }), (req, res) => {
    req.auth.logout()
    res.redirect('/')
  })
}