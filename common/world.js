/** @module common/world */

/**
 * The empty world's state.
 * 
 * @constant
 * @default
 */
const defaultInitialState = {
  x: 0,
  y: 0,
  dir: 0,
  v: 0
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
  applyControls({ mX, mY, lmb, rmb, wheel }) {
    const { x, y, dir, v } = this.state

    const dx = mX - x,
          dy = mY - y

    this.state.dir = Math.atan2(dy, dx)
    this.state.v = lmb ? 0.5 : 0

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
    const { x, y, dir, v } = this.state

    this.state.x += Math.cos(dir) * v * dt
    this.state.y += Math.sin(dir) * v * dt

    return this
  }
}

module.exports = World