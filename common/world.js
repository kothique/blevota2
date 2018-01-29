/** @module common/world */

/**
 * The empty world's state.
 * 
 * @constant
 * @default
 */
const defaultInitialState = {
  orbs: {}
}

class World {
  /**
   * Create a new world.
   * 
   * @param {?object} initialState - Initial state.
   */
  constructor(initialState = defaultInitialState) {
    this.state = initialState
  }

  /**
   * Set velocity and direction according to controls.
   * 
   * @param {number} id - The user's id.
   * @param {object} controls - The user's controls.
   * @return {object} - Reference to this.
   */
  applyControls(id, { mX, mY, lmb, rmb, wheel }) {
    const { orbs } = this.state

    if (orbs[id]) {
      const dx = mX - orbs[id].x,
            dy = mY - orbs[id].y

      orbs[id].dir = Math.atan2(dy, dx)
      orbs[id].v = lmb ? 0.5 : 0
    }

    return this
  }

  /**
   * Advance the physics by dt.
   * 
   * @param {number} t  - Current timestamp.
   * @param {number} dt - Time delta.
   * @return {object} - Reference to this.
   */
  integrate(t, dt) {
    const { orbs } = this.state

    orbs.forEach((orb) => {
      const { x, y, dir, v } = orb

      orb.x += Math.cos(dir) * v * dt
      orb.y += Math.sin(dir) * v * dt
    })

    return this
  }
}

module.exports = World