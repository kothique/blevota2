/**
 * @module common/world
 */

 const Entity = require('./entity')
 const State = require('./state')

 /**
  * @constant
  */
const ORB_MASS = 1

/**
 * @constant
 */
const ORB_MOVE_FORCE = 0.1

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
  }

  /**
   * Add a new orb into the world.
   *
   * @param {string} id - The id of the new orb.
   * @chainable
   */
  newOrb(id) {
    const orb = new Entity(ORB_MASS, ORB_MOVE_FORCE)
    this.state.orbs[id] = orb

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
    const { orbs } = this.state

    for (let id in orbs)
      orbs[id].applyControls(id, controls)

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

    for (let id in orbs)
      orbs[id].integrate(t, dt)

    return this
  }
}

module.exports = World