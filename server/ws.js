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
module.exports = (app, wss) => {
  wss.on('connection', (ws) => {
    console.log(`A new WebSocket connection established`)

    ws.on('close', () => {
      console.log('A WebSocket connection closed')
    })

    ws.close()

    // /* Parse session and check authorization */
    // sessionParser(ws.upgradeReq, {}, () => {
    //   const userId = ws.upgradeReq.session.userId

    //   if (!userId) {
    //     if (ws.readyState === WebSocket.OPEN) { // the connection can be already closed by this time
    //       ws.send(sendError('Unauthorized'))
    //     }
    //     return ws.close()
    //   }

    //   ws.userId = userId

    //   let match = new Match
    //   match.newPlayer(app, ws)
    //   match.start()
    // })
  })
}