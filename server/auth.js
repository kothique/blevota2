const bcrypt = require('bcryptjs')

const User = require('./db/user')

class AuthError extends Error {
  constructor(...params) {
    super(...params)
  }
}

module.exports.AuthError = AuthError

module.exports.createUser = (username, password) =>
new Promise((resolve, reject) => {
  User.findOne({ username }, (err, user) => {
    if (err) {
      reject(err)
      return
    }

    if (user) {
      reject(new AuthError(`User "${username}" already exists`))
      return
    }

    let newUser = new User({
      username,
      password: bcrypt.hashSync(password, 8)
    })

    newUser.save(err => {
      if (err) {
        reject(err)
        return
      }

      console.log(`New user created(${newUser._id})`)
      resolve(newUser)
    })
  })
})

module.exports.removeUser = (username) =>
new Promise((resolve, reject) => {
  User.remove({ username }, err => {
    if (err) {
      reject(err)
      return
    }

    resolve()
  })
})

function authenticate(req, user) {
  if (req.session.userId) {
    logout(req)
  }

  req.session.userId = user._id
  console.log(`User logged in (${user._id})`)
}

function login(req, username, password) {
  return new Promise((resolve, reject) => {
    User.findOne({ username }, (err, user) => {
      if (err) return reject(err)

      if (!user || !bcrypt.compareSync(password, user.password)) {
        reject(new AuthError('Wrong credentials'))
        return
      }

      authenticate(req, user)
      resolve()
    })
  })
}

function logout(req) {
  const id = req.session.userId

  if (id) {
    delete req.session.userId
    console.log(`User disconnected (${id})`)
  }
}

function check(req) {
  return typeof req.session.userId != 'undefined'
}

function guest(req) {
  return !check(req)
}

async function user(req) {
  if (check(req)) {
    let user = await User.findOne({ _id: req.session.userId })

    return user
  }

  return null
}

module.exports.middleware = () =>
(req, res, next) => {
  req.auth = {
    authenticate: authenticate.bind(null, req),
    login: login.bind(null, req),
    logout: logout.bind(null, req),
    check: check.bind(null, req),
    guest: guest.bind(null, req)
  }

  if (req.session.userId) {
    User.findById(req.session.userId, (err, user) => {
      if (err || !user) {
        delete req.session.userId
        delete req.auth.user
        delete req.auth.userId
      } else {
        req.auth.user = user
        req.auth.userId = req.session.userId
      }

      next()
    })
  } else {
    next()
  }
}

module.exports.ifGuest = (options) =>
(req, res, next) => {
  if (!req.session.userId) {
    if (options.redirect) {
      res.redirect(options.redirect)
    } else if (options.error) {
      res.status(401).send('Unauthorized')
    } else {
      throw new Error('No redirect or error options provided')
    }

    return
  }

  next()
}

module.exports.ifUser = (options) =>
(req, res, next) => {
  if (req.session.userId) {
    if (options.redirect) {
      res.redirect(options.redirect)
    } else if (options.error) {
      res.status(403).send('Forbidden')
    } else {
      throw new Error('No redirect or error options provided')
    }

    return
  }

  next()
}
