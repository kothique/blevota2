/**
 * @module server/game/orbs/gold
 */

const Orb        = require('./orb')
const Immunity   = require('../skills/immunity')
const Reflection = require('../skills/reflection')
const Vision     = require('../skills/vision')

const { ORBS: { GOLD } } = require('../../../common/const')

/** @class */
class Gold extends Orb {
  constructor(options, orbAPI) {
    super(options, orbAPI)

    this.skillManager.skills = [
      this.api.createSkill(Immunity),
      this.api.createSkill(Reflection),
      this.api.createSkill(Vision)
    ]

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