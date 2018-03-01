/**
 * @module server/io
 *
 * @description
 * This module accepts new socket.io connections and pass
 * them to {@link module:server/region~Region}.
 */

const auth = require('./auth')
const RegionManager = require('./region-manager')

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
    const { address, user, query: { regionName } } = socket.handshake

    console.log(`A new socket.io connection established (${user.username}; ${address})`)

    socket.on('error', (err) => {
      console.log(`Error: ${err.message}`)
    })

    socket.on('disconnect', (reason) => {
      console.log(`Client disconnected: ${reason}`)
    })

    const region = RegionManager.get(regionName)

    if (!region)
      return socket.disconnect()

    region.newPlayer(socket)
  })
}
