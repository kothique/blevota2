/**
 * @module common/orb
 */

const Entity = require('./entity')

/**
 * @class
 */
class Orb extends Entity {
  constructor() {
    super(Orb.mass, Orb.moveForce)
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