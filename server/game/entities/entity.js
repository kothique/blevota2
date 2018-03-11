/**
 * @module server/game/entity
 */

const Set = require('collections/set')

const { UNKNOWN } = require('../../../common/entities')
const { V, Vector } = require('../../../common/vector')

class Entity {
  /**
   * Create a new entity.
   *
   * @param {object}   options
   * @param {number}   options.mass
   * @param {?number}  options.moveForce
   * @param {?number}  options.dragForceFactor
   * @param {?Vector}  options.position
   * @param {?Vector}  options.velocity
   * @param {?Vector}  options.force
   * @param {object}   entityAPI
   */
  constructor(options, entityAPI) {
    this.api = entityAPI

    this.mass            = options.mass
    this.moveForce       = options.moveForce         || 0
    this.dragForceFactor = options.dragForceFactor   || 1
    this.position        = options.position          || V(0, 0)
    this.velocity        = options.velocity          || V(0, 0)
    this.force           = options.force             || V(0, 0)
  }

  /**
   * Advance the physics of the entity by the timestep `dt`.
   * It uses semi-implicit Euler method.
   *
   * @param {number} t - Timestamp in seconds.
   * @param {number} dt - Timestep in seconds.
   * @chainable
   */
  integrate(t, dt) {
    const dragForce = this.velocity.clone()
      .setLength(-0.001 * this.dragForceFactor * this.velocity.length() ** 2)

    this.force.add(dragForce)
    this.acceleration = Vector.divide(this.force, this.mass)
    this.velocity.add(this.acceleration)
    this.position.add(this.velocity)

    return this
  }

  /**
   * Write the entity to a buffer.
   *
   * @param {Buffer} buffer
   * @param {number} offset
   * @chainable
   */
  serialize(buffer, offset = 0) {
    buffer.writeDoubleBE(this.position.x, offset)
    offset += 8

    buffer.writeDoubleBE(this.position.y, offset)
    offset += 8

    return this
  }

  /**
   * The size of the entity serialized.
   *
   * @return {number}
   */
  serializedLength() {
    return 16
  }

  get type() {
    return UNKNOWN
  }
}

module.exports = Entity