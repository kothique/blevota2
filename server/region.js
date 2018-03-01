/**
 * @module server/region
 */

const forIn = require('lodash/forIn')
const child_process = require('child_process')
const WebSocket = require('ws')

/**
 * Used to to feed different ports to different children.
 */
let childIndex = 1

/**
 * @class
 *
 * @description
 * The intermediate between players and the world simulation.
 */
class Region {
  /**
   * Create a new region.
   *
   * @param {string} name
   */
  constructor(name) {
    this.players = Object.create(null)
    this.name = name

    this.simulation = child_process.fork('./server/simulation', null, {
      env: process.env
    })

    this.simulation.on('message', (msg) => {
      switch (msg.type) {
        case 'FRAME':
          this.toAllPlayers('frame', msg.frame)
          break

        case 'DEATH':
          const socket = this.players[msg.id]
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
   * Add a new player to the region.
   *
   * @param {Socket} newSocket - The socket.io socket corresponding to the player.
   */
  newPlayer(newSocket) {
    const { user } = newSocket.handshake

    /** Send the new player to all already existing orbs */
    forIn(this.players, (socket, id) => {
      newSocket.emit('new-orb', id)
    })
    this.players[user.id] = newSocket

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
   * Remove the specified player from the region.
   *
   * @param {string} id
   */
  removePlayer(id) {
    forIn(this.players, (socket) => {
      socket.emit('remove-orb', id)
    })

    delete this.players[id]

    this.sendRemoveOrb(id)
  }

  /**
   * Start the simulation.
   */
  run() {
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
      console.log(`Region #${this.name}: ${err.message}`)
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
      console.log(`Region #${this.name}: ${err.message}`)
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
      console.log(`Region ${this.name}: ${err.message}`)
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
      console.log(`Region ${this.name}: ${err.message}`)
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
      console.log(`Region ${this.name}: ${err.message}`)
    }
  }

  /**
   * Send the message to all players in the region.
   *
   * @private
   * @param {string|number} type
   * @param {...any}        args
   */
  toAllPlayers(type, ...args) {
    try {
      forIn(this.players, (socket) => {
        socket.emit(type, ...args)
      })
    } catch (err) {
      console.log(`Region ${this.name}: ${err.message}`)
    }
  }
}

module.exports = Region