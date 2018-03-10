/**
 * @module server/game/skill/pull
 */

const Skill = require('./skill')
const Magnetism = require('../effects/magnetism')
const SkillState = require('../../../common/skill-state')

class Pull extends Skill {
  /**
   * Apply magnetism.
   *
   * @param {Orb} owner
   * @override
   */
  onDown(owner) {
    this.state = {
      type: SkillState.ACTIVE
    }

    this.effect = this.api.createEffect(Magnetism, {
      minValue: 0.05,
      maxValue: 0.15,
      radius: 300
    })
    owner.receiveEffect(this.effect)
  }

  /**
   * Remove magnetism.
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

module.exports = Pull