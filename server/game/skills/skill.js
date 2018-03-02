/**
 * @module server/game/skills/skill
 */

class Skill {
  /**
   * Create a new skill.
   */
  constructor() {
    this.state = {
      type: Skill.READY
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
}

Skill.READY    = 0x1
Skill.ACTIVE   = 0x2
Skill.NO_MANA  = 0x3
Skill.COOLDOWN = 0x4

module.exports = Skill