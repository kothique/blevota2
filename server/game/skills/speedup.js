/**
 * @module server/game/skill/speedup
 */

const Skill = require('./skill')
const EffectSpeedUp = require('../effects/speedup')
const SkillState = require('../../../common/skill-state')

const VALUE = 1

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

    owner.dragForceFactor -= VALUE
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

    owner.dragForceFactor += VALUE
  }
}

module.exports = SpeedUp