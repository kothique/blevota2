/**
 * @module server/game/skills/immunity
 */

const Skill = require('./skill')

const { ACTIVE, READY } = require('../../../common/skill-state')

/** @class */
class Immunity extends Skill {
  onDown(owner) {
    this.state = { type: ACTIVE }

    owner.damageImmune = true
    owner.spellImmune  = true
  }

  onUp(owner) {
    this.state = { type: READY }

    owner.damageImmune = false
    owner.spellImmune  = false
  }

  serializeForOrb(buffer, offset = 0) {
    buffer.writeUInt8(this.state.type === ACTIVE, offset++)
  }

  get binaryLengthForOrb() { return 1 }
}

module.exports = Immunity