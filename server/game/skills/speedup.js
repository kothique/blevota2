/**
 * @module server/game/skill/speedup
 */

const Skill = require('./skill')
const EffectSpeedUp = require('../effects/speedup')
const SkillState = require('../../../common/skill-state')

class SpeedUp extends Skill {
  /**
   * Apply speed up effect.
   *
   * @param {Orb} owner
   * @override
   */
  onDown(owner) {
    this.state = {
      type: SkillState.ACTIVE
    }

    this.effect = new EffectSpeedUp(1.0)
    owner.receiveEffect(this.effect)
  }

  /**
   * Remove speed up effect.
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

module.exports = SpeedUp