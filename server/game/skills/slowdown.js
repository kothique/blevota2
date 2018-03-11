/**
 * @module server/game/skill/slowdown
 */

const Skill = require('./skill')
const EffectSlowDown = require('../effects/slowdown')
const SkillState = require('../../../common/skill-state')

const VALUE = 1

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

    owner.dragForceFactor += VALUE
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

    owner.dragForceFactor -= VALUE
  }
}

module.exports = SlowDown