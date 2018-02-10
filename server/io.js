/**
 * @module server/io
 *
 * @description
 * This module accepts new socket.io connections and pass
 * them to {@link module:server/match~Match}.
 */

const auth = require('./auth')
const { matches } = require('./matches')

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
    const { address, user, query: { matchId } } = socket.handshake

    console.log(`A new socket.io connection established (${user.username}; ${address})`)

    socket.on('error', (err) => {
      console.log(`Error: ${err.message}`)
    })

    socket.on('disconnect', (reason) => {
      console.log(`Client disconnected: ${reason}`)
    })

    const match = matches[matchId]

    if (!match)
      return socket.disconnect()

    match.newPlayer(socket)
  })
}
