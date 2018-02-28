/**
 * @module server/game/effects/instant-damage
 */
const Effect = require('../effect')
const { INSTANT_DAMAGE } = require('../../../common/effects')

/**
 * @class
 */
class InstantDamage extends Effect {
  /**
   * Create a new instant damage effect.
   *
   * @param {number} value
   */
  constructor(value) {
    super()

    this.value = value
  }

  /**
   * Take some health points from the entity's target.
   *
   * @param {Entity} target
   */
  onReceive(target) {
    target.hp -= this.value

    this.die()
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

    buffer.writeUInt8(INSTANT_DAMAGE, offset)
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

module.exports = InstantDamage