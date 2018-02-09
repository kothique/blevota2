/**
 * @module common/world
 */

const set = require('lodash/set')
const merge = require('lodash/merge')

const Orb = require('./orb')
const State = require('./state')
const { v } = require('./vector')

/**
 * @class
 */
class World {
  /**
   * Create a new world.
   *
   * @param {State} initialState - Initial state.
   */
  constructor(initialState = new State) {
    this.state = initialState
    this.diff = {}
    this.collisions = []
  }

  /**
   * Add a new orb into the world.
   *
   * @param {string} id - The id of the new orb.
   * @chainable
   */
  newOrb(id) {
    const orb = new Orb
    this.state.orbs[id] = orb

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
   * @param {number} id - The user's id.
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

      if (orbDiff)
        set(this.diff, `orbs.${id}`, orbDiff)
    }

    return this
  }

  /**
   * Detect collisions according to `this.diff`.
   *
   * @chainable
   */
  detectCollisions() {
    // ...

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