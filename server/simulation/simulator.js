/**
 * @module server/simulation/simulator
 */

const EventEmitter = require('events')
const present = require('present')
const Dict = require('collections/dict')

const World = require('../game/world')
const Orb = require('../game/entities/orb')
const { Vector, V } = require('../../common/vector')

/**
 * @class
 *
 * @description
 * Update the world state as the time goes by.
 */
const Simulator = {
  /**
   * Initialize the simulator.
   *
   * @param {?object} options
   * @param {?object} options.world
   * @param {?number} t
   * @param {?number} dt
   */
  init(options = Object.create(null)) {
    this.world = options.world || new World({
      size: V(800, 600)
    })

    this.world.on('death', (orbID) => {
      process.send({
        type: 'DEATH',
        orbID
      })
    })

    this.t = options.t || 0
    this.dt = options.dt || 1000 / 120 // milliseconds
    this.accumulator = 0

    this.continue = true

    this.controls = Object.create(null)
  },

  /**
   * Update controls for the given orb.
   *
   * @param {number} id - The id of the orb.
   * @param {object} controls - The controls.
   */
  setControls(id, controls) {
    const { pX, pY, move,
            skill1, skill2, skill3,
            skill4, skill5, skill6 } = controls

    if (this.controls[id]) {
      if (typeof pX !== 'undefined')
        this.controls[id].pX = pX

      if (typeof pY !== 'undefined')
        this.controls[id].pY = pY

      if (typeof move !== 'undefined')
        this.controls[id].move = move

      if (typeof skill1 !== 'undefined')
        this.controls[id].skill1 = skill1

      if (typeof skill2 !== 'undefined')
        this.controls[id].skill2 = skill2

      if (typeof skill3 !== 'undefined')
        this.controls[id].skill3 = skill3

      if (typeof skill4 !== 'undefined')
        this.controls[id].skill4 = skill4

      if (typeof skill5 !== 'undefined')
        this.controls[id].skill5 = skill5

      if (typeof skill6 !== 'undefined')
        this.controls[id].skill6 = skill6
    }
  },

  /**
   * Add a new orb to the simulation.
   *
   * @return {number} - The ID of the new orb.
   */
  newOrb() {
    const id = this.world.new(new Orb({
      radius: 20 + Math.random() * 30,
      maxHp: 100,
      hp: 80,
      maxMp: 100,
      mp: 80,
      position: V(
        50 + Math.random() * 700,
        50 + Math.random() * 500
      )
    }))

    this.controls[id] = {
      pX: 0,
      pY: 0,
      move: false,
      skill1: false,
      skill2: false,
      skill3: false,
      skill4: false,
      skill5: false,
      skill6: false
    }

    return id
  },

  /**
   * Remove the specified orb from the simulation.
   *
   * @param {number} id - The ID of the orb.
   */
  removeOrb(id) {
    this.world.remove(id)
    delete this.controls[id]
  },

  /**
   * Start the simulation.
   */
  start() {
    console.log(`Simulation started (PID: ${process.pid})`)

    this.continue = true
    this.begin = present()

    let currentTime = Date.now()

    const loop = () => {
      if (!this.continue) {
        process.exit()
        return
      }

      let newTime = Date.now(),
          frameTime = newTime - currentTime

      if (frameTime > 1000 / 60) {
        frameTime = 1000 / 60
      }
      currentTime = newTime

      this.accumulator += frameTime

      this.world.clearForces()

      let integrated = false
      while (this.accumulator >= this.dt) {
        this.world
          .applyControls(this.controls)
          .integrate(this.t / 1000, this.dt / 1000)
          .applyEffects(this.t / 1000, this.dt / 1000)
        integrated = true

        this.t += this.dt
        this.accumulator -= this.dt
      }

      if (integrated) {
        process.send({
          type: 'FRAME',
          frame: {
            buffer: this.world.toBuffer(),
            timestamp: this.t
          }
        })

        this.world.handleCollisions()
      }

      if (Date.now() - currentTime < this.dt) {
        setTimeout(loop)
      } else {
        setImmediate(loop)
      }
    }

    loop()
  },

  /**
   * Stop the simulation.
   */
  stop() {
    this.continue = false

    console.log(`Simulation stopped (PID: ${process.pid})`)
  }
}

process.on('message', (msg) => {
  switch (msg.type) {
    case 'NEW_ORB':
      const orbID = Simulator.newOrb(),
            playerID = msg.playerID

      process.send({
        type: 'ORB_CREATED',
        playerID,
        orbID
      })
      break
    case 'REMOVE_ORB':
      Simulator.removeOrb(msg.orbID)
      break
    case 'START':
      Simulator.start()
      break
    case 'STOP':
      Simulator.stop()
      break
    case 'CONTROLS':
      Simulator.setControls(msg.id, msg.controls)
      break
  }
})

module.exports = Simulator