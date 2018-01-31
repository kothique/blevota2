/**
 * @module server/ws
 *
 * @description
 * This module accepts new WebSocket connections and pass
 * them to {@link server/match~Match}.
 */

const FastSet = require('collections/fast-set')

const User = require('./db/user')
const Match = require('./match')

/**
 * The collection of all matches.
 *
 * @type {FastSet}
 */
const matches = new FastSet

module.exports = (server) => {
  const io = require('socket.io')(server)

  io.onconnection('connection', (socket) => {})
}