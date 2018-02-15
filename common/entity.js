/**
 * @module common/entity
 */

const { Vector, V } = require('../common/vector')
const set = require('lodash/set')
const { Set } = require('collections/set')

/**
 * @class
 *
 * @description
 * An entity is a physical object.
 */
class Entity {
  /**
   * Create a new entity.
   *
   * @param {object} options - Options.
   * The options are as follows:
   *  radius:     number,
   *  mass:       number,
   *  moveForce: ?number = 0,
   *  position:  ?Vector = V(0, 0),
   *  velocity:  ?Vector = V(0, 0),
   *  force:     ?Vector = V(0, 0)
   */
  constructor(options) {
    this.radius       = options.radius
    this.mass         = options.mass
    this.moveForce    = options.moveForce    || 0
    this.position     = options.position     || V(0, 0)
    this.velocity     = options.velocity     || V(0, 0)
    this.force        = options.force        || V(0, 0)
    this.acceleration = V(0, 0)

    this.effects = new Set
  }

  /**
   * Set forces according to controls.
   *
   * @param {object} controls - Controls.
   * @chainable
   */
  applyControls(controls) {
    const { mX, mY, lmb, rmb, wheel } = controls

    if (lmb && this.moveForce) {
      this.force.add(V(mX, mY).subtract(this.position).setLength(this.moveForce))
    }

    return this
  }

  /**
   * Receive an effect.
   *
   * @param {Effect} effect
   */
  receive(effect) {
    this.effects.add(effect)
  }

  /**
   * Apply the entity's effects.
   *
   * @param {number} dt - Timestep in seconds.
   */
  applyEffects(dt) {
    this.effects.forEach((effect) => {
      effect.apply(this, dt)

      if (effect.alive === false) {
        this.effects.remove(effect)
      }
    })
  }

  /**
   * Advance the physics of the entity by the timestep `dt`.
   * It uses semi-implicit Euler method.
   *
   * @param {number} t - Current timestamp in seconds.
   * @param {number} dt - Timestep in seconds.
   * @chainable
   */
  integrate(t, dt) {
    const dragForce = this.velocity.clone().setLength(-0.001 * this.velocity.length() ** 2)

    this.force.add(dragForce)
    this.acceleration = Vector.divide(this.force, this.mass)
    this.velocity.add(this.acceleration)
    this.position.add(this.velocity)

    return this
  }

  /**
   * Write the entity's binary representation into a buffer.
   *
   * @param {Buffer} buffer - The buffer to write to.
   * @param {number} offset
   */
  writeToBuffer(buffer, offset) {
    buffer.writeDoubleBE(this.radius,     offset + 8 * 0)
    buffer.writeDoubleBE(this.mass,       offset + 8 * 1)
    buffer.writeDoubleBE(this.moveForce,  offset + 8 * 2)

    buffer.writeDoubleBE(this.position.x, offset + 8 * 3)
    buffer.writeDoubleBE(this.position.y, offset + 8 * 4)

    buffer.writeDoubleBE(this.velocity.x, offset + 8 * 5)
    buffer.writeDoubleBE(this.velocity.y, offset + 8 * 6)

    buffer.writeDoubleBE(this.force.x,    offset + 8 * 7)
    buffer.writeDoubleBE(this.force.y,    offset + 8 * 8)
  }

  /**
   * Create an entity from a buffer.
   *
   * @param {Buffer} buffer - The buffer to create the entitiy from.
   * @param {number} offset - Offset in bytes.
   * @return {Entity} - The resulting entity object.
   */
  static fromBuffer(buffer, offset) {
    let entity = new Entity({
      radius:    buffer.readDoubleBE(offset + 8 * 0),
      mass:      buffer.readDoubleBE(offset + 8 * 1),
      moveForce: buffer.readDoubleBE(offset + 8 * 2),
      position: V(
        buffer.readDoubleBE(offset + 8 * 3),
        buffer.readDoubleBE(offset + 8 * 4)
      ),
      velocity: V(
        buffer.readDoubleBE(offset + 8 * 5),
        buffer.readDoubleBE(offset + 8 * 6)
      ),
      force: V(
        buffer.readDoubleBE(offset + 8 * 7),
        buffer.readDoubleBE(offset + 8 * 8)
      ),
    })

    return entity
  }
}

/**
 * The size of an entity in a binary buffer.
 *
 * @type {number}
 * @static
 */
Entity.binaryLength = 8 * 9

module.exports = Entity