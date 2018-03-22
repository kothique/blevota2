/**
 * @module server/game/skills/skill
 */

const state = require('../../../common/skill-state')

class Skill {
  /**
   * Create a new skill.
   *
   * @param {object} options
   * @param {object} skillAPI
   */
  constructor(options, skillAPI) {
    this.api = skillAPI
    this.state = {
      type: state.READY
    }
  }

  /**
   * When the skill button is pushed.
   *
   * @param {Orb} owner
   */
  onDown(owner) {}

  onTick(owner, t, dt) {}

  /**
   * When the skill button is released.
   *
   * @param {Orb} owner
   */
  onUp(owner) {}

  /**
   * @param {Buffer}  buffer
   * @param {?number} offset
   */
  serializeForSkillBox(buffer, offset = 0) {
    buffer.writeUInt8(this.state.type, offset)
    offset++

    if (this.state.type === state.COOLDOWN) {
      buffer.writeUInt16BE(this.state.value, offset)
      offset += 2
    }
  }

  /** @return {number} */
  get binaryLengthForSkillBox() {
    return 1 + 2 * (this.state.type === state.COOLDOWN)
  }

  /** @virtual */
  serializeForOrb(buffer, offset = 0) {}

  /** @virtual */
  get binaryLengthForOrb() { return 0 }
}

module.exports = Skill