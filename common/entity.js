/**
 * @module common/entity
 */

const { Vector, v } = require('../common/vector')

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
   * @param {number} id - The user's id.
   * @param {object} controls - The user's controls.
   * @chainable
   */
  applyControls(id, { mX, mY, lmb, rmb, wheel }) {
    if (lmb && this.moveForce) {
      this.force = v(mX, mY).subtract(this.position).normalize().multiply(this.moveForce)
    } else {
      this.force = v(0, 0)
    }

    return this
  }

  /**
   * Advance the physics of the entity by the timestep `dt`.
   * It uses semi-implicit Euler method.
   *
   * @param {number} t - Current timestamp.
   * @param {number} dt - Timestep.
   * @chainable
   */
  integrate(t, dt) {
    const dragForce = this.velocity.normalized().multiply(-0.001 * this.velocity.length() ** 2)

    this.force.add(dragForce)
    this.acceleration = Vector.divide(this.force, this.mass)
    this.velocity.add(this.acceleration)
    this.position.add(this.velocity)

    return this
  }
}

/**
 * Translate the object into a buffer.
 *
 * @param {Buffer} buffer - The buffer to write to.
 * @param {number} offset - The offset.
 */
Entity.prototype.writeToBuffer = function (buffer, offset) {
  buffer.writeDoubleBE(this.force.x, offset + 8 * 0)
  buffer.writeDoubleBE(this.force.y, offset + 8 * 1)

  buffer.writeDoubleBE(this.position.x, offset + 8 * 2)
  buffer.writeDoubleBE(this.position.y, offset + 8 * 3)

  buffer.writeDoubleBE(this.velocity.x, offset + 8 * 4)
  buffer.writeDoubleBE(this.velocity.y, offset + 8 * 5)

  buffer.writeDoubleBE(this.acceleration.x, offset + 8 * 6)
  buffer.writeDoubleBE(this.acceleration.y, offset + 8 * 7)

  buffer.writeDoubleBE(this.mass, offset + 8 * 8)
  buffer.writeDoubleBE(this.moveForce, offset + 8 * 9)
}

/**
 * Create an entity from a buffer.
 *
 * @param {Buffer} buffer - The buffer to create the entitiy from.
 * @param {number} offset - The offset starting with which to read the entity.
 * @return {Entity} - The resulting entity object.
 */
Entity.fromBuffer = function (buffer, offset) {
  const mass = buffer.readDoubleBE(offset + 8 * 8),
        moveForce = buffer.readDoubleBE(offset + 8 * 9)

  let entity = new Entity(mass)

  entity.force.x = buffer.readDoubleBE(offset + 8 * 0)
  entity.force.y = buffer.readDoubleBE(offset + 8 * 1)

  entity.position.x = buffer.readDoubleBE(offset + 8 * 2)
  entity.position.y  = buffer.readDoubleBE(offset + 8 * 3)

  entity.velocity.x = buffer.readDoubleBE(offset + 8 * 4)
  entity.velocity.y = buffer.readDoubleBE(offset + 8 * 5)

  entity.acceleration.x = buffer.readDoubleBE(offset + 8 * 6)
  entity.acceleration.y = buffer.readDoubleBE(offset + 8 * 7)

  return entity
}

/**
 * The size of an entity in a binary buffer.
 *
 * @type {number}
 * @static
 */
Entity.binaryLength = 8 * 10

module.exports = Entity