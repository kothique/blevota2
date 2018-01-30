/**
 * @module server/ws
 *
 * @description
 * This module accepts new WebSocket connections and pass
 * them to {@link server/match~Match}.
 */

const FastSet = require('collections/fast-set')
const WebSocket = require('ws')

const User = require('./db/user')
const Match = require('./match')

/**
 * The collection of all matches.
 *
 * @type {FastSet}
 */
const matches = new FastSet

/**
 * Construct an error message to be sent to a client.
 *
 * @param {string} error - An error message.
 * @return {string} - The resulting message.
 */
const sendError = (error) => JSON.stringify({
  type: 'ERROR',
  error
})

/**
 * Create a new match on every authorized connection.
 *
 * @param {Express} app - The `express` application.
 * @param {WebSocketServer} wss - The WebSocket server.
 * @param {function} sessionParser - The session parser to get user info from the request.
 */
module.exports = (app, wss, sessionParser) => {
  wss.on('connection', (ws) => {
    if (!ws.readyState !== WebSocket.OPEN) {
      return
    }

    console.log(`A new connection established`)

    /* Parse session and check authorization */
    sessionParser(ws.upgradeReq, {}, () => {
      const userId = ws.upgradeReq.session.userId

      if (!userId) {
        ws.send(sendError('Unauthorized'))
        ws.close()
        return
      }

      ws.userId = userId

      let match = new Match
      match.newPlayer(ws)
      match.start()
    })
  })
}