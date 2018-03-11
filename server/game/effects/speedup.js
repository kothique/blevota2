/**
 * @module server/game/effects/speedup
 */
const Effect = require('./effect')
const { SPEEDUP } = require('../../../common/effects')

/**
 * @class
 */
class SpeedUp extends Effect {
  /**
   * Create a new speedup effect.
   *
   * @param {object} options
   * @param {number} options.value - Added to the target's drag force factor.
   * @param {object} effectAPI
   */
  constructor(options, effectAPI) {
    super(options, effectAPI)

    this.value = options.value
  }

  /**
   * Increase the target's movement force.
   *
   * @param {Entity} target
   */
  onReceive(target) {
    target.dragForceFactor -= this.value
  }

  /**
   * Decrease the target's movement force back.
   *
   * @param {Entity} target
   */
  onRemove(target) {
    target.dragForceFactor += this.value
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
    offset += super.binaryLength

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
  get binaryLength() {
    return super.binaryLength + 9
  }
}

module.exports = SpeedUp