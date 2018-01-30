/**
 * @module common/world
 */

/**
 * @class
 */
class World {
  /**
   * Create a new world.
   * 
   * @param {?object} initialState - Initial state.
   */
  constructor(initialState = null) {
    this.state = initialState || { orbs: {} }
  }

  /**
   * Adds a new orb into the world.
   *
   * @param {string} id - The id of the new orb.
   * @return {World} - Reference to `this`.
   */
  newOrb(id) {
    this.state.orbs[id] = {
      x: 0,
      y: 0,
      dir: 0,
      v: 0
    }

    return this
  }

  /**
   * Set velocity and direction according to controls.
   * 
   * @param {number} id - The user's id.
   * @param {object} controls - The user's controls.
   * @return {World} - Reference to `this`.
   */
  applyControls(id, { mX, mY, lmb, rmb, wheel }) {
    const { orbs } = this.state

    for (let id in orbs) {
      const dx = mX - orbs[id].x,
            dy = mY - orbs[id].y,
            dir = Math.atan2(dy, dx)

      orbs[id].dir = dir
      orbs[id].v = lmb ? 0.5 : 0
    }

    return this
  }

  /**
   * Advance the physics by dt.
   * 
   * @param {number} t  - Current timestamp.
   * @param {number} dt - Time delta.
   * @return {World} - Reference to `this`.
   */
  integrate(t, dt) {
    const { orbs } = this.state

    for (let id in orbs) {
      const { x, y, dir, v } = orbs[id]

      orbs[id].x += Math.cos(dir) * v * dt
      orbs[id].y += Math.sin(dir) * v * dt
    }

    return this
  }
}

module.exports = World