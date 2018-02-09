/**
 * @module common/entity
 */

const { Vector, v } = require('../common/vector')
const set = require('lodash/set')

/**
 * @class
 *
 * @description
 * An entity is a physical object that can have position and move.
 */
class Entity {
  /**
   * Create a new entity.
   *
   * @param {number} mass - The mass of the entity.
   * @param {?number} moveForce - Determines how fast the entity moves.
   */
  constructor(mass, moveForce = 0) {
    this.force = new Vector
    this.position = new Vector
    this.velocity = new Vector
    this.acceleration = new Vector
    this.mass = mass

    if (moveForce)
      this.moveForce = moveForce
  }

  /**
   * Set forces according to controls.
   *
   * @param {object} controls - Controls.
   * @chainable
   */
  applyControls(controls) {
    const { mX, mY, lmb, rmb, wheel } = controls

    if (lmb && this.moveForce)
      this.force.add(v(mX, mY).subtract(this.position).normalize().multiply(this.moveForce))

    return this
  }

  /**
   * Advance the physics of the entity by the timestep `dt`.
   * It uses semi-implicit Euler method.
   *
   * @param {number} t - Current timestamp.
   * @param {number} dt - Timestep.
   * @return {object} - Diff.
   */
  integrate(t, dt) {
    const dragForce = this.velocity.normalized().multiply(-0.001 * this.velocity.length() ** 2),
          diff = {}

    this.force.add(dragForce)
    if (!dragForce.isZero(0)) {
      set(diff, 'force.x', this.force.x)
      set(diff, 'force.y', this.force.y)
    }

    this.acceleration = Vector.divide(this.force, this.mass)
    if (!dragForce.isZero(0)) {
      set(diff, 'acceleration.x', this.acceleration.x)
      set(diff, 'acceleration.y', this.acceleration.y)
    }

    this.velocity.add(this.acceleration)
    if (!this.acceleration.isZero(0)) {
      set(diff, 'velocity.x', this.velocity.x)
      set(diff, 'velocity.y', this.velocity.y)
    }

    this.position.add(this.velocity)
    if (!this.velocity.isZero(0)) {
      set(diff, 'position.x', this.position.x)
      set(diff, 'position.y', this.position.y)
    }

    return diff
  }

  /**
   * Translate the object into a buffer.
   *
   * @param {Buffer} buffer - The buffer to write to.
   * @param {number} offset - The offset.
   */
  writeToBuffer(buffer, offset) {
    buffer.writeDoubleBE(this.force.x, offset + 8 * 0)
    buffer.writeDoubleBE(this.force.y, offset + 8 * 1)

    buffer.writeDoubleBE(this.position.x, offset + 8 * 2)
    buffer.writeDoubleBE(this.position.y, offset + 8 * 3)

    buffer.writeDoubleBE(this.velocity.x, offset + 8 * 4)
    buffer.writeDoubleBE(this.velocity.y, offset + 8 * 5)

    buffer.writeDoubleBE(this.mass, offset + 8 * 6)
    buffer.writeDoubleBE(this.moveForce, offset + 8 * 7)
  }

  /**
   * Create an entity from a buffer.
   *
   * @param {Buffer} buffer - The buffer to create the entitiy from.
   * @param {number} offset - The offset starting with which to read the entity.
   * @return {Entity} - The resulting entity object.
   */
  static fromBuffer(buffer, offset) {
    const mass = buffer.readDoubleBE(offset + 8 * 6),
          moveForce = buffer.readDoubleBE(offset + 8 * 7)

    const entity = new Entity(mass)

    entity.force.x = buffer.readDoubleBE(offset + 8 * 0)
    entity.force.y = buffer.readDoubleBE(offset + 8 * 1)

    entity.position.x = buffer.readDoubleBE(offset + 8 * 2)
    entity.position.y  = buffer.readDoubleBE(offset + 8 * 3)

    entity.velocity.x = buffer.readDoubleBE(offset + 8 * 4)
    entity.velocity.y = buffer.readDoubleBE(offset + 8 * 5)

    entity.acceleration = Vector.divide(entity.force, entity.mass)

    return entity
  }
}

/**
 * The size of an entity in a binary buffer.
 *
 * @type {number}
 * @static
 */
Entity.binaryLength = 8 * 8

module.exports = Entity