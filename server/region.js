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
    this.playersByID = Object.create(null)
    this.playersByOrbID = Object.create(null)
    this.name = name

    this.simulation = child_process.fork('./server/simulation', null, {
      env: process.env
    })

    this.simulation.on('message', (msg) => {
      let player

      switch (msg.type) {
        case 'FRAME':
          const { world, skills, timestamp } = msg.frame

          forIn(this.playersByID, ({ socket, orbID }, playerID) => {
            socket.emit('frame', {
              world,
              skills: skills[orbID],
              timestamp
            })
          })
          break

        case 'ORB_CREATED':
          if (player = this.playersByID[msg.playerID]) {
            player.orbID = msg.orbID

            this.playersByOrbID[player.orbID] = player

            player.socket.on('controls', (controls) => {
              this.sendControls(player.orbID, controls)
            })

            player.socket.emit('orb-id', player.orbID)
            this.toAllPlayers('new-orb', player.orbID)
          }
          break

        case 'DEATH':
          if (player = this.playersByOrbID[msg.orbID]) {
            const { user } = player.socket.handshake

            this.toAllPlayers('event:death', { user })

            this.removePlayer(user.id)
          }

          break
      }
    })
  }

  /**
   * Add a new player to the region.
   *
   * @param {Socket} socket - The socket.io socket corresponding to the player.
   */
  newPlayer(newSocket) {
    const { user } = newSocket.handshake

    /** Send all existing orbs to the new player */
    forIn(this.playersByID, (player) => {
      newSocket.emit('new-orb', player.orbID)
    })

    newSocket.on('error', () => {
      this.removePlayer(user.id)
    })

    newSocket.on('disconnect', () => {
      this.removePlayer(user.id)
    })

    this.playersByID[user.id] = {
      socket: newSocket,
      orbID: null
    }

    this.sendNewOrb(user.id)
  }

  /**
   * Remove the specified player from the region.
   *
   * @param {string} playerID
   */
  removePlayer(playerID) {
    const player = this.playersByID[playerID]

    if (player) {
      forIn(this.playersByID, ({ socket }) => {
        socket.emit('remove-orb', player.orbID)
      })

      delete this.playersByOrbID[player.orbID]
      delete this.playersByID[playerID]

      this.sendRemoveOrb(player.orbID)
    }
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
      console.log(`Region ${this.name}:`)
      console.log(err.stack)
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
      console.log(`Region ${this.name}:`)
      console.log(err.stack)
    }
  }

  /**
   * Order the simulation to add a new orb.
   *
   * @private
   * @param {string} id - The player's ID.
   */
  sendNewOrb(playerID) {
    try {
      this.simulation.send({
        type: 'NEW_ORB',
        playerID
      })
    } catch (err) {
      console.log(`Region ${this.name}:`)
      console.log(err.stack)
    }
  }

  /**
   * Order the simulation to remove the specified orb.
   *
   * @param {number} id - The player's ID.
   */
  sendRemoveOrb(orbID) {
    try {
      this.simulation.send({
        type: 'REMOVE_ORB',
        orbID
      })
    } catch (err) {
      console.log(`Region ${this.name}:`)
      console.log(err.stack)
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
      console.log(`Region ${this.name}:`)
      console.log(err.stack)
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
      forIn(this.playersByID, ({ socket }) => {
        socket.emit(type, ...args)
      })
    } catch (err) {
      console.log(`Region ${this.name}:`)
      console.log(err.stack)
    }
  }
}

module.exports = Region