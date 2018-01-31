/**
 * @module server/match
 */

const child_process = require('child_process')
const Dict = require('collections/dict')
const WebSocket = require('ws')

/**
 * @class
 * 
 * @description
 * A game match, the intermediate between the participants and
 * the world simulation running in the background.
 */
class Match {
  constructor() {
    this.players = new Dict
    this.simulation = child_process.fork('./server/simulation')

    this.simulation.on('message', (msg) => {
      switch (msg.type) {
        case 'FRAME':
          this.sendFrameToAll(msg.frame)
          break
      }
    })
  }

  /**
   * Add a new player to the match.
   *
   * @param {Express} app - The `express` application.
   * @param {WebSocket} ws - The WebSocket connection corresponding to the player.
   */
  newPlayer(app, ws) {
    this.players.set(ws.userId, ws)

    app.ws('/', (ws) => {
      ws.on('close', () => {
        this.stop()
      })

      ws.on('message', (data) => {
        const msg = JSON.parse(data)
        switch (msg.type) {
          case 'CONTROLS':
            this.sendControls(ws, msg.controls)
            break
        }
      })
    })

    this.sendNewOrb(ws)
  }

  /**
   * Start the simulation.
   */
  start() {
    this.sendStart()
  }

  /**
   * Stop the simulation.
   */
  stop() {
    this.sendStop()
  }

  /**
   * Order the simulation the start.
   *
   * @private
   */
  sendStart() {
    this.simulation.send({
      type: 'START'
    })
  }

  /**
   * Order the simulation to stop.
   *
   * @private
   */
  sendStop() {
    this.simulation.send({
      type: 'STOP'
    })
  }

  /**
   * Order the simulation to add a new orb.
   * 
   * @private
   * @param {WebSocket} ws - The WebSocket connection correspoding to the player.
   */
  sendNewOrb(ws) {
    this.simulation.send({
      type: 'NEW_ORB',
      id: ws.userId
    })
  }

  /**
   * Send controls to the simulation.
   *
   * @private
   * @param {WebSocket} ws - The WebSocket connection correspoding to the player.
   * @param {object} controls - The player's controls data.
   */
  sendControls(ws, controls) {
    this.simulation.send({
      type: 'CONTROLS',
      id: ws.userId,
      controls
    })
  }

  /**
   * Send the frame to all the players in the match.
   *
   * @private
   * @param {object} frame - The frame to send.
   */
  sendFrameToAll(frame) {
    this.players.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'FRAME',
          frame
        }))
      }
    })
  }
}

module.exports = Match