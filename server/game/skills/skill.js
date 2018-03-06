/**
 * @module server/game/skills/skill
 */

const state = require('../../../common/skill-state')

class Skill {
  /**
   * Create a new skill.
   */
  constructor() {
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

  /**
   * When the skill button is released.
   *
   * @param {Orb} owner
   */
  onUp(owner) {}

  /**
   * Write the skill to a buffer.
   *
   * @param {Buffer}  buffer
   * @param {?number} offset
   * @chainable
   */
  serialize(buffer, offset = 0) {
    buffer.writeUInt8(this.state.type, offset)
    offset += 1

    if (this.state.type === state.COOLDOWN) {
      buffer.writeUInt16BE(this.state.value, offset)
      offset += 2
    }

    return this
  }

  /**
   * The size of the skill serialized.
   *
   * @return {number}
   */
  serializedLength() {
    return 1 + 2 * (this.state.type === state.COOLDOWN)
  }
}

module.exports = Skill