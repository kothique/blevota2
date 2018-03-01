/**
 * @module server/game/effects/instant-damage
 */
const Effect = require('./effect')
const Orb = require('../entities/orb')
const { INSTANT_DAMAGE } = require('../../../common/effects')

/**
 * @class
 */
class InstantDamage extends Effect {
  /**
   * Create a new instant damage effect.
   *
   * @param {object}  options
   * @param {number}  options.value
   * @param {string?} options.from
   */
  constructor(options) {
    super()

    this.value = options.value
    this.from = options.from || null
  }

  /**
   * Take some health points from the entity's target.
   *
   * @param {Entity} target
   */
  onReceive(target) {
    if (target instanceof Orb) {
      target.hp -= this.value

      if (target.hp < 0) {
        target.die()
      }
    }

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