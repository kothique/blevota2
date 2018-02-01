/**
 * @module server/io
 *
 * @description
 * This module accepts new socket.io connections and pass
 * then to {@link module:server/match~Match}
 */

 const FastSet = require('collections/fast-set')
 const auth = require('./auth')

 const Match = require('./match')

/**
 * The collection of all matches.
 *
 * @type {FastSet}
 */
const matches = new FastSet

/**
 * Configure the socket.io server.
 *
 * @param {io.Server} io
 */
module.exports = (io) => {
  const onError = (err, socket) => {
    const { address } = socket.handshake
    console.log(`Socket ${address} failed authentication: ${err.message}`)
  }

  io.use(auth.socketIoMiddleware({
    onEmptyToken: onError,
    onInvalidSignature: onError
  }))

  io.on('connection', (socket) => {
    const { address, user } = socket.handshake

    console.log(`A new socket.io connection established (${user.username}; ${address})`)

    socket.on('error', (err) => {
      console.log(`Error: ${err.message}`)
    })

    socket.on('disconnect', (reason) => {
      console.log(`Client disconnected: ${reason}`)
    })

    let match = new Match
    match.newPlayer(socket)
    match.start()
  })
}