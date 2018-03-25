/**
 * @module server/game/orbs/green
 */

const Orb          = require('./orb')
const Invisibility = require('../skills/invisibility')
const HiddenStrike = require('../skills/hidden-strike')

const { ORBS: { GREEN } } = require('../../../common/const')

/** @class */
class Green extends Orb {
  constructor(options, orbAPI) {
    super(options, orbAPI)

    this.skillManager.skills = [
      this.api.createSkill(Invisibility),
      this.api.createSkill(HiddenStrike)
    ]

    this.maxStamina = options.maxStamina
    this.stamina    = options.maxStamina
  }

  serialize(buffer, offset = 0) {
    super.serialize(buffer, offset)
    offset += super.binaryLength

    buffer.writeUInt16BE(this.maxStamina, offset)
    offset += 2

    buffer.writeUInt16BE(this.stamina, offset)
    offset += 2
  }

  get binaryLength() { return super.binaryLength + 4 }

  get type() { return GREEN }
}

module.exports = Green