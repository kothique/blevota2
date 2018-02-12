/**
 * @module server/auth
 */

const bcrypt = require('bcryptjs')

const User = require('./db/user')
const { authSecret } = require('../server.config')
const jwt = require('jsonwebtoken')

/**
 * @class
 */
class AuthError extends Error {
  constructor(...params) {
    super(...params)
  }
}
module.exports.AuthError = AuthError

/**
 * Create a new user.
 *
 * @param {string} username
 * @param {string} password
 * @return {Promise}
 */
module.exports.createUser = (username, password) => new Promise((resolve, reject) => {
  User.findOne({ username }, (err, user) => {
    if (err)
      return reject(err)

    if (user)
      return reject(new AuthError(`User "${username}" already exists`))

    const newUser = new User({
      username,
      password: bcrypt.hashSync(password, 8)
    })

    newUser.save((err) => {
      if (err)
        return reject(err)

      console.log(`New user created(${newUser._id})`)
      resolve(newUser)
    })
  })
})

/**
 * Remove an existing user.
 *
 * @param {string} username 
 * @return {Promise}
 */
module.exports.removeUser = (username) => new Promise((resolve, reject) => {
  User.remove({ username }, (err) => {
    if (err)
      return reject(err)

    resolve()
  })
})

/**
 * Try to login with the given credentials.
 *
 * @param {string} username
 * @param {string} password
 * @return {Promise} - Resolved with the user or rejected with an error.
 */
module.exports.login = (username, password) => new Promise((resolve, reject) => {
  User.findOne({ username }, (err, user) => {
    if (err)
      return reject(err)
    
    if (!user || !bcrypt.compareSync(password, user.password))
      return reject(new AuthError('Wrong credentials'))
    
    resolve(user)
  })
})

/**
 * Create an express middleware that adds two methods for
 * dealing with JWT authentication: req.getJWT, res.sendJWT.
 *
 * @param {?object} options
 * @return {function} - The middleware.
 */
module.exports.expressMiddleware = (options = Object.create(null)) => {
  const {} = options

  return (req, res, next) => {
    /**
     * Get JWT token.
     *
     * @return {Promise} - Resolved with the payload or rejected with an error.
     */
    req.getJWT = function () {
      return new Promise((resolve, reject) => {
        if (!this.header('authorization'))
          return resolve()
        
        const parts = this.header('authorization').split(/\s+/)

        if (parts.length !== 2)
          return reject(new AuthError('Bad Authorization header format'))

        const scheme = parts[0],
              token = parts[1]
        
        if (!/^Bearer$/i.test(scheme))
          return reject(new AuthError('Bad Authorization header format'))
        
        jwt.verify(token, authSecret, (err, payload) => {
          if (err)
            return reject(new AuthError('Invalid signature'))

          resolve(payload)
        })
      })
    }

    /**
     * Create the JWT token and send it to the client.
     *
     * @param {object} user - The user to authenticate.
     */
    res.sendJWT = function (user) {
      const payload = {
        id: user._id,
        username: user.username
      }

      const token = jwt.sign(payload, authSecret)

      this.json({ token })
    }

    next()
  }
}

/**
 * Create a socket.io middleware that authenticates clients.
 *
 * @param {?object} options - { onEmptyToken, onInvalidSignature }.
 * @return {function} - The middleware.
 */
module.exports.socketIoMiddleware = (options = Object.create(null)) => {
  const { onEmptyToken, onInvalidSignature } = options

  return (socket, next) => {
    const token = socket.handshake.query.token

    if (!token) {
      const msg = 'Unauthorized'

      onEmptyToken && process.nextTick(() => {
        onEmptyToken(new AuthError(msg), socket)
      })

      return next(new Error(msg))
    }

    jwt.verify(token, authSecret, (err, payload) => {
      if (err) {
        const msg = 'Invalid signature'

        onInvalidSignature && process.nextTick(() => {
          onInvalidSignature(new AuthError(msg), socket)
        })

        return next(new Error(msg))
      }

      socket.handshake.user = payload

      next()
    })
  }
}

/**
 * An express middleware that checks if the user is not logged in.
 *
 * @param {?object} options  - { redirect: string } or { error: bool }.
 */
module.exports.ifGuest = (options = { error: true }) => {
  const { redirect, error } = options

  return (req, res, next) => {
    req.getJWT()
      .then(() => {
        if (typeof redirect !== 'undefined') {
          res.redirect(redirect)
        } else if (error) {
          if (err instanceof AuthError) {
            res.status(401).send({ error: `Unauthorized (${err.message})` })
          } else {
            res.status(401).send({ error: 'Unauthorized' })
          }
        }
      })
      .catch((err) => {
        next()
      })
  }
}

/**
 * An express middleware that checks if the user is authenticated.
 *
 * @param {?object} options  - { redirect: string } or {error: bool }.
 */
module.exports.ifUser = (options = { error: true }) => {
  const { redirect, error } = options

  return (req, res, next) => {
    req.getJWT()
      .then(() => {
        next()
      })
      .catch((err) => {
        if (typeof redirect !== 'undefined') {
          res.redirect(redirect)
        } else if (error) {
          res.status(403).send({ error: 'Must not be logged in' })
        }
      })
  }
}