/**
 * @module server/region
 */

const forIn = require('lodash/forIn')
const child_process = require('child_process')
const WebSocket = require('ws')

const { ORBS: { RED, GOLD }, randomOrbType } = require('../common/const')

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

    this.game = child_process.fork('./server/game', null, {
      env: process.env
    })

    this.game.on('message', (msg) => {
      let player

      switch (msg.type) {
        case 'FRAMES':
          const { frames, timestamp } = msg

          forIn(frames, ({ world, skills }, orbID) => {
            const player = this.playersByOrbID[orbID]

            if (player) {
              player.socket.emit('frame', {
                world,
                skills,
                timestamp
              })
            }
          })
          break

        case 'ORB_CREATED':
          if (player = this.playersByID[msg.playerID]) {
            player.orbID   = msg.orbID
            player.orbType = msg.orbType

            this.playersByOrbID[player.orbID] = player

            player.socket.removeAllListeners('controls')
            player.socket.on('controls', (controls) => {
              this.sendControls(player.orbID, controls)
            })

            player.socket.emit('orb-id', player.orbID)
            this.toAllPlayers('new-orb', player.orbID, msg.orbType)
          }
          break

        case 'DEATH':
          if (player = this.playersByOrbID[msg.orbID]) {
            const { user } = player.socket.handshake

            this.toAllPlayers('event:death', { user })
            this.resurrectPlayer(user.id, 3000)
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
    const { user } = newSocket.handshake,
          orbType = randomOrbType()

    /** Send all existing orbs to the new player */
    forIn(this.playersByID, (player) => {
      newSocket.emit('new-orb', player.orbID, player.orbType)
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

    this.toAllPlayers('event:join', { user })

    this.sendNewOrb(user.id, orbType)
  }

  /**
   * Remove the old dead orb and create a new one for the specified player.
   *
   * @param {string} playerID 
   * @param {number} delay
   */
  resurrectPlayer(playerID, delay) {
    const player = this.playersByID[playerID]

    if (player) {
      forIn(this.playersByID, ({ socket }) => {
        socket.emit('remove-orb', player.orbID)
      })
      delete this.playersByOrbID[player.orbID]

      this.sendRemoveOrb(player.orbID)
      player.orbID   = null
      player.orbType = null

      setTimeout(() => {
        this.sendNewOrb(playerID, randomOrbType())
      }, delay)
    }
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

        socket.emit('event:leave', { user: socket.handshake.user })
      })

      delete this.playersByOrbID[player.orbID]
      delete this.playersByID[playerID]

      this.sendRemoveOrb(player.orbID)
    }
  }

  /**
   * Start the game.
   */
  run() {
    this.sendStart()
  }

  /**
   * Stop the game.
   */
  stop() {
    this.sendStop()
  }

  /**
   * Order the game to start.
   *
   * @private
   */
  sendStart() {
    try {
      this.game.send({
        type: 'START'
      })
    } catch (err) {
      console.log(`Region ${this.name}:`)
      console.log(err.stack)
    }
  }

  /**
   * Order the game to stop.
   *
   * @private
   */
  sendStop() {
    try {
      this.game.send({
        type: 'STOP'
      })
    } catch (err) {
      console.log(`Region ${this.name}:`)
      console.log(err.stack)
    }
  }

  /**
   * Order the game to add a new orb.
   *
   * @private
   * @param {string} id - The player's ID.
   */
  sendNewOrb(playerID, orbType) {
    try {
      this.game.send({
        type: 'NEW_ORB',
        playerID,
        orbType
      })
    } catch (err) {
      console.log(`Region ${this.name}:`)
      console.log(err.stack)
    }
  }

  /**
   * Order the game to remove the specified orb.
   *
   * @param {number} id - The player's ID.
   */
  sendRemoveOrb(orbID) {
    try {
      this.game.send({
        type: 'REMOVE_ORB',
        orbID
      })
    } catch (err) {
      console.log(`Region ${this.name}:`)
      console.log(err.stack)
    }
  }

  /**
   * Send controls to the game.
   *
   * @private
   * @param {WebSocket} ws - The player's id.
   * @param {object} controls - The player's controls data.
   */
  sendControls(id, controls) {
    try {
      this.game.send({
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