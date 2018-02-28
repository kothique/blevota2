/**
 * @module server/match
 */

const child_process = require('child_process')
const Dict = require('collections/dict')
const WebSocket = require('ws')

/**
 * Used to to feed different ports to different children.
 */
let childIndex = 1

/**
 * @class
 *
 * @description
 * A game match, the intermediate between the participants and
 * the world simulation running in the background.
 */
class Match {
  /**
   * Create a new match.
   *
   * @param {string} id
   */
  constructor(id) {
    this.players = new Dict
    this.id = id
    this.createdAt = Date.now()

    const config = {
      env: process.env
    }
    if (process.env.NODE_ENV !== 'production') {
      config.env.INSPECTOR_PORT = require('../server.config').inspector.port + childIndex++
    }

    this.simulation = child_process.fork('./server/simulation', null, config)

    this.simulation.on('message', (msg) => {
      switch (msg.type) {
        case 'FRAME':
          this.toAllPlayers('frame', msg.frame)
          break

        case 'DEATH':
          const socket = this.players.get(msg.id)
          if (socket) {
            this.toAllPlayers('event:death', {
              user: socket.handshake.user
            })

            this.removePlayer(msg.id)
          }

          break
      }
    })
  }

  /**
   * Add a new player to the match.
   *
   * @param {Socket} newSocket - The socket.io socket corresponding to the player.
   */
  newPlayer(newSocket) {
    const { user } = newSocket.handshake

    /** Send the new player to all already existing orbs */
    this.players.forEach((socket, id) => {
      newSocket.emit('new-orb', id)
    })
    this.players.set(user.id, newSocket)

    /** Notify all players of the new orb */
    this.toAllPlayers('new-orb', user.id)

    newSocket.on('error', () => {
      this.removePlayer(user.id)
    })

    newSocket.on('disconnect', () => {
      this.removePlayer(user.id)
    })

    newSocket.on('controls', (controls) => {
      this.sendControls(user.id, controls)
    })

    this.sendNewOrb(user.id)
  }

  /**
   * Remove the specified player from the match.
   *
   * @param {string} id
   */
  removePlayer(id) {
    this.players.forEach((socket) => {
      socket.emit('remove-orb', id)
    })

    this.players.delete(id)

    this.sendRemoveOrb(id)
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
   * Order the simulation to start.
   *
   * @private
   */
  sendStart() {
    try {
      this.simulation.send({
        type: 'START'
      })
    } catch (err) {
      console.log(`Match (${this.id}): ${err.message}`)
    }
  }

  /**
   * Order the simulation to stop.
   *
   * @private
   */
  sendStop() {
    try {
      this.simulation.send({
        type: 'STOP'
      })
    } catch (err) {
      console.log(`Match (${this.id}): ${err.message}`)
    }
  }

  /**
   * Order the simulation to add a new orb.
   *
   * @private
   * @param {string} id - The player's ID.
   */
  sendNewOrb(id) {
    try {
      this.simulation.send({
        type: 'NEW_ORB',
        id
      })
    } catch (err) {
      console.log(`Match (${this.id}): ${err.message}`)
    }
  }

  /**
   * Order the simulation to remove the specified orb.
   *
   * @param {string} id - The player's ID.
   */
  sendRemoveOrb(id) {
    try {
      this.simulation.send({
        type: 'REMOVE_ORB',
        id
      })
    } catch (err) {
      console.log(`Match (${this.id}): ${err.message}`)
    }
  }

  /**
   * Send controls to the simulation.
   *
   * @private
   * @param {WebSocket} ws - The player's id.
   * @param {object} controls - The player's controls data.
   */
  sendControls(id, controls) {
    try {
      this.simulation.send({
        type: 'CONTROLS',
        id,
        controls
      })
    } catch (err) {
      console.log(`Match (${this.id}): ${err.message}`)
    }
  }

  /**
   * Send the message to all players in the match.
   *
   * @private
   * @param {string|number} type
   * @param {...any}        args
   */
  toAllPlayers(type, ...args) {
    try {
      this.players.forEach((socket) => {
        socket.emit(type, ...args)
      })
    } catch (err) {
      console.log(`Match (${this.id}): ${err.message}`)
    }
  }
}

module.exports = Match
