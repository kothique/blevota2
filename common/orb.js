/**
 * @module common/orb
 */

const Entity = require('./entity')

/**
 * @class
 */
class Orb extends Entity {
  /**
   * Create a new orb.
   *
   * @param {object} options - Options { radius: number }.
   */
  constructor(options) {
    super({
      ...options,
      mass: Orb.mass,
      moveForce: Orb.moveForce
    })
  }
}

/**
 * @type {number}
 * @static
 */
Orb.mass = 1

/**
 * @type {number}
 * @static
 */
Orb.moveForce = 0.1

module.exports = Orb