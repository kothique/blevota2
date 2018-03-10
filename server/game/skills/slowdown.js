/**
 * @module server/game/skill/slowdown
 */

const Skill = require('./skill')
const EffectSlowDown = require('../effects/slowdown')
const SkillState = require('../../../common/skill-state')

class SlowDown extends Skill {
  /**
   * Apply slow down effect.
   *
   * @param {Orb} owner
   * @override
   */
  onDown(owner) {
    this.state = {
      type: SkillState.ACTIVE
    }

    this.effect = new EffectSlowDown(1.0)
    owner.receiveEffect(this.effect)
  }

  /**
   * Remove slow down effect.
   *
   * @param {Orb} owner
   * @override
   */
  onUp(owner) {
    this.state = {
      type: SkillState.READY
    }

    owner.removeEffect(this.effect)
    delete this.effect
  }
}

module.exports = SlowDown