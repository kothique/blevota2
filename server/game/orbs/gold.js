/**
 * @module server/game/orbs/gold
 */

const Orb = require('./orb')

const { ORBS: { GOLD } } = require('../../../common/const')

/** @class */
class Gold extends Orb {
  constructor(options, orbAPI) {
    super({
      ...options,
      skills: {

      }
    }, orbAPI)

    this.maxMana = options.maxMana
    this.mana    = options.maxMana
  }

  serialize(buffer, offset = 0) {
    super.serialize(buffer, offset)
    offset += super.binaryLength

    buffer.writeUInt16BE(this.maxMana, offset)
    offset += 2

    buffer.writeUInt16BE(this.mana, offset)
    offset += 2
  }

  get binaryLength() { return super.binaryLength + 4 }

  get type() { return GOLD }
}

module.exports = Gold