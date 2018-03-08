/**
 * @module server/game/simulator
 */

const EventEmitter = require('events')
const present = require('present')
const merge = require('lodash/merge')
const forIn = require('lodash/forIn')

const World = require('./world')
const Orb = require('./entities/orb')
const { Vector, V } = require('../../common/vector')

/**
 * Define the rectangle around the orb that can be seen by the player.
 */
const VISION = V(1366, 768).divide(2)

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
      size: V(2000, 2000)
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
    if (this.controls[id]) {
      merge(this.controls[id], controls)
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
      skillA1: false,
      skillA2: false,
      skillA3: false,
      skillA4: false,
      skillA5: false,
      skillA6: false,
      skillB1: false,
      skillB2: false,
      skillB3: false,
      skillB4: false,
      skillB5: false,
      skillB6: false,
      skillC1: false,
      skillC2: false,
      skillC3: false,
      skillC4: false,
      skillC5: false,
      skillC6: false
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
        this.sendFrames()
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
  },

  /**
   * Send frames to the parent process.
   */
  sendFrames() {
    const frames = Object.create(null)

    forIn(this.world.entities, (entity, id) => {
      if (entity instanceof Orb) {
        const orb    = entity,
              skills = orb.skillsToBuffer(),
              world  = this.world.rectangleToBuffer({
                p1: Vector.subtract(orb.position, VISION),
                p2: Vector.     add(orb.position, VISION)
              })

        frames[id] = {
          world,
          skills
        }
      }
    })

    process.send({
      type: 'FRAMES',
      frames,
      timestamp: this.t
    })
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