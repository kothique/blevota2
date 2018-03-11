/**
 * @module server/game/simulator
 */

const EventEmitter = require('events')
const present = require('present')
const merge = require('lodash/merge')
const forIn = require('lodash/forIn')

const World = require('./world')
const Orb = require('./entities/orb')

const { Vector, V }     = require('../../common/vector')
const { VISION_RADIUS } = require('../../common/game')
const { ORB }           = require('../../common/entities')

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
   * @param {?number} options.t
   * @param {?number} options.dt
   */
  init(options = Object.create(null)) {
    this.world = options.world || new World({
      size: V(3000, 3000)
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
    const id = this.world.new(this.world.createEntity(Orb, {
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
      skill6: false,
      skill7: false,
      skill8: false,
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
          .applyEffects(this.t / 1000, this.dt / 1000)
          .integrate(this.t / 1000, this.dt / 1000)
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
      if (entity.type === ORB) {
        const orb    = entity,
              skills = orb.skillsToBuffer(),
              world  = this.world.boxToBuffer({
                minP: Vector.subtract(orb.position, VISION_RADIUS),
                maxP: Vector.     add(orb.position, VISION_RADIUS),
                for:  orb
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