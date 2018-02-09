/**
 * @module common/world
 */

const set = require('lodash/set')
const merge = require('lodash/merge')

const Orb = require('./orb')
const State = require('./state')
const CollisionDetector = require('./collision-detector')
const { Vector, v } = require('./vector')

/**
 * @class
 */
class World {
  /**
   * Create a new world.
   *
   * @param {?Vector} worldSize - The size of the world. If left undefined,
   *   collisions with walls will not be detected.
   * @param {?State} initialState - Initial state.
   */
  constructor(worldSize = null, initialState = new State) {
    this.worldSize = worldSize
    this.state = initialState
    this.diff = {}
    this.collisions = []
    this.collisionDetector = new CollisionDetector(this.worldSize)
  }

  /**
   * Add a new orb into the world.
   *
   * @param {string} id - The ID of the new orb.
   * @chainable
   */
  newOrb(id) {
    const orb = new Orb
    this.state.orbs[id] = orb

    this.collisionDetector.add(id, {
      p1: v(-30, -30),
      p2: v(30, 30)
    })

    return this
  }

  /**
   * Delete the specified orb.
   *
   * @param {string} id - The ID of the orb.
   * @chainable
   */
  removeOrb(id) {
    delete this.state.orbs[id]
    this.collisionDetector.remove(id)

    return this
  }

  /**
   * Clear forces of all orbs in the world.
   *
   * @chainable
   */
  startIteration() {
    const { orbs } = this.state

    for (const id in orbs)
      orbs[id].force = v(0, 0)

    return this
  }

  /**
   * Set forces according to controls.
   *
   * @param {number} id - The user's ID.
   * @param {object} controls - The user's controls.
   * @chainable
   */
  applyControls(id, controls) {
    const { orbs } = this.state,
          orb = orbs[id]
    
    if (orb) {
      orb.applyControls(controls)
    }

    return this
  }

  /**
   * Apply forces according to collisions.
   *
   * @todo
   * @chainable
  */
  applyCollisionResponse() {
    // ...

    return this
  }

  /**
   * Advance the physics by dt.
   * 
   * @param {number} t  - Current timestamp.
   * @param {number} dt - Time delta.
   * @chainable
   */
  integrate(t, dt) {
    const { orbs } = this.state

    for (const id in orbs) {
      const orbDiff = orbs[id].integrate(t, dt)

      if (orbDiff) {
        set(this.diff, `orbs.${id}`, orbDiff)

        if (orbDiff.position) {
          const { x, y } = orbDiff.position

          this.collisionDetector.set(id, {
            p1: v(x - 30, y - 30),
            p2: v(x + 30, y + 30)
          })
        }
      }
    }

    return this
  }

  /**
   * Detect collisions according to `this.diff`.
   *
   * @chainable
   */
  detectCollisions() {
    this.collisions = this.collisionDetector.detect()

    return this
  }

  /**
   * Merge `this.diff` into `this.state` to prepare for the next iteration.
   *
   * @chainable
   */
  finishIteration() {
    merge(this.state, this.diff)
    this.diff = {}

    return this
  }
}

module.exports = World