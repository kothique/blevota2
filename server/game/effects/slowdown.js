/**
 * @module server/game/effects/slowdown
 */
const Effect = require('./effect')
const { SLOWDOWN } = require('../../../common/effects')

/**
 * @class
 */
class SlowDown extends Effect {
  /**
   * Create a new slow down effect.
   *
   * @param {number} value - Added to the target's move force.
   */
  constructor(value) {
    super()

    this.value = value
  }

  /**
   * Decrease the target's movement force.
   *
   * @param {Entity} target
   */
  onReceive(target) {
    target.moveForce -= this.value
  }

  /**
   * Increase the target's movement force back.
   *
   * @param {Entity} target
   */
  onRemove(target) {
    target.moveForce += this.value
  }

  /**
   * Write the effect to a buffer.
   *
   * @param {Buffer} buffer
   * @param {number} offset
   * @chainable
   */
  serialize(buffer, offset = 0) {
    super.serialize(buffer, offset)
    offset += super.serializedLength()

    buffer.writeUInt8(SLOWDOWN, offset)
    offset += 1

    buffer.writeDoubleBE(this.value, offset)
    offset += 8

    return this
  }

  /**
   * Return the size of the effect serialized.
   *
   * @return {number}
   */
  serializedLength() {
    return super.serializedLength() + 9
  }
}

module.exports = SlowDown
