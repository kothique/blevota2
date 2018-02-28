/**
 * @module server/game/effects/speedup
 */
const Effect = require('../effect')
const { SPEEDUP } = require('../../../common/effects')

/**
 * @class
 */
class SpeedUp extends Effect {
  /**
   * Create a new speedup effect.
   *
   * @param {number} value - Added to the target's move force.
   */
  constructor(value) {
    super()

    this.value = value
  }

  /**
   * Increase the target's move force.
   *
   * @param {Entity} target
   */
  onReceive(target) {
    target.moveForce += this.value
  }

  /**
   * Decresee the target's move force back.
   *
   * @param {Entity} target
   */
  onRemove(target) {
    target.moveForce -= this.value
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

    buffer.writeUInt8(SPEEDUP, offset)
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

module.exports = SpeedUp