const bcrypt = require('bcryptjs')

// @flow
const User = require('./db/user')

class AuthError extends Error {
  constructor(...params: Array<mixed>) {
    super(...params)
  }
}

module.exports.AuthError = AuthError

module.exports.createUser =
  (username: string, password: string): Promise<User> =>
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

module.exports.removeUser = (username: string): Promise<void> =>
  new Promise((resolve, reject) => {
    User.remove({ username }, err => {
      if (err) {
        reject(err)
        return
      }

      resolve()
    })
  })

function authenticate(request, user) {
  if (request.session.userId) {
    logout(request)
  }

  request.session.userId = user._id
  console.log(`User logged in (${user._id})`)
}

function login(request, username, password) {
  return new Promise((resolve, reject) => {
    User.findOne({ username }, (err, user) => {
      if (err) return reject(err)

      if (!user || !bcrypt.compareSync(password, user.password)) {
        reject(new AuthError('Wrong credentials'))
        return
      }

      authenticate(request, user)
      resolve()
    })
  })
}

function logout(request) {
  const id = request.session.userId

  if (id) {
    delete request.session.userId
    console.log(`User disconnected (${id})`)
  }
}

function check(request) {
  return typeof request.session.userId != 'undefined'
}

function guest(request) {
  return !check(request)
}

async function user(request) {
  if (check(request)) {
    let user = await User.findOne({ _id: request.session.userId })

    return user
  }

  return null
}

module.exports.middleware = () =>
  (request: Object, response: Object, next: () => void) => {
    request.auth = {
      authenticate: authenticate.bind(null, request),
      login: login.bind(null, request),
      logout: logout.bind(null, request),
      check: check.bind(null, request),
      guest: guest.bind(null, request)
    }

    if (request.session.userId) {
      User.findById(request.session.userId, (err, user) => {
        if (err || !user) {
          delete request.session.userId
          delete request.auth.user
          delete request.auth.userId
        } else {
          request.auth.user = user
          request.auth.userId = request.session.userId
        }

        next()
      })
    } else {
      next()
    }
  }

module.exports.ifGuest = (options: Object = {}) =>
  (request: Object, response: Object, next: Function) => {
    if (!request.session.userId) {
      if (options.redirect) {
        response.redirect(options.redirect)
      } else if (options.error) {
        response.status(401).send('Unauthorized')
      } else {
        throw new Error('No redirect or error options provided')
      }

      return
    }

    next()
}

module.exports.ifUser = (options: Object = {}) =>
  (request: Object, response: Object, next: Function) => {
    if (request.session.userId) {
      if (options.redirect) {
        response.redirect(options.redirect)
      } else if (options.error) {
        response.status(403).send('Forbidden')
      } else {
        throw new Error('No redirect or error options provided')
      }

      return
    }

    next()
  }
