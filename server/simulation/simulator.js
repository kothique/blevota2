/**
 * @module server/simulation/simulator
 */

const EventEmitter = require('events')
const present = require('present')
const Dict = require('collections/dict')

const World = require('../../common/world')

/**
 * @class
 *
 * @description
 * Update the world state as the time goes by.
 */
class Simulator extends EventEmitter {
  /**
   * Create a new simulator.
   *
   * @param {object} options - Options: { world: World, t: number, dt: number }.
   */
  constructor(options = {}) {
    super()

    this.world = options.world || new World
    this.t = options.t || 0
    this.dt = options.dt || 1000 / 120 // milliseconds
    this.accumulator = 0

    this.continue = true

    this.controls = new Dict
  }

  /**
   * Update controls for the given orb.
   *
   * @param {string} id - The id of the orb.
   * @param {object} controls - The controls.
   */
  setControls(id, controls) {
    const { mX, mY, lmb, wheel, rmb } = controls

    if (typeof mX !== 'undefined')
      this.controls.get(id).mX = mX

    if (typeof mY !== 'undefined')
      this.controls.get(id).mY = mY

    if (typeof lmb !== 'undefined')
      this.controls.get(id).lmb = lmb

    if (typeof wheel !== 'undefined')
      this.controls.get(id).wheel = wheel

    if (typeof rmb !== 'undefined')
      this.controls.get(id).rmb = rmb
  }

  /**
   * Add a new orb to the world.
   *
   * @param {string} id - The id of the new orb.
   */
  newOrb(id) {
    this.world.newOrb(id)

    this.controls.set(id, {
      mX: 0,
      mY: 0,
      lmb: false,
      wheel: false,
      rmb: false
    })
  }

  /**
   * Start the simulation.
   */
  start() {
    this.emit('start')

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

      let integrated = false
      while (this.accumulator >= this.dt) {
        this.controls.forEach((controls, id) => {
          this.world.applyControls(id, controls)
        })

        this.world.integrate(this.t, this.dt / 1000) // pass dt in seconds
        integrated = true

        this.t += this.dt
        this.accumulator -= this.dt
      }

      if (integrated) {
        //console.log(JSON.stringify(this.world.state))
        this.emit('frame', {
          state: this.world.state.toBuffer(),
          timestamp: this.t
        })
      }

      if (Date.now() - currentTime < this.dt - 4) {
        setTimeout(loop)
      } else {
        setImmediate(loop)
      }
    }

    loop()
  }

  /**
   * Stop the simulation.
   */
  stop() {
    this.continue = false

    this.emit('stop')
  }
}

module.exports = Simulator