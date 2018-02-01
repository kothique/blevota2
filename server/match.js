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
   * @param {Socket} app - The socket.io socket corresponding to the player.
   */
  newPlayer(socket) {
    const { user } = socket.handshake

    this.players.set(user.id, socket)

    socket.on('error', () => {
      this.stop()
    })

    socket.on('disconnect', () => {
      this.stop()
    })

    socket.on('controls', (controls) => {
      this.sendControls(user.id, controls)
    })

    this.sendNewOrb(user.id)
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
   * @param {string} id - The player's id.
   */
  sendNewOrb(id) {
    this.simulation.send({
      type: 'NEW_ORB',
      id
    })
  }

  /**
   * Send controls to the simulation.
   *
   * @private
   * @param {WebSocket} ws - The player's id.
   * @param {object} controls - The player's controls data.
   */
  sendControls(id, controls) {
    this.simulation.send({
      type: 'CONTROLS',
      id,
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
    this.players.forEach((socket) => {
      socket.emit('frame', frame)
    })
  }
}

module.exports = Match