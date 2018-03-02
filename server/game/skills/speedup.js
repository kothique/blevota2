/**
 * @module server/game/skill/speedup
 */

const Skill = require('./skill')
const EffectSpeedUp = require('../effects/speedup')

class SpeedUp extends Skill {
  /**
   * Apply speed up effect.
   *
   * @param {Orb} owner
   * @override
   */
  onDown(owner) {
    this.effect = new EffectSpeedUp(0.25)
    owner.receiveEffect(this.effect)
  }

  /**
   * Remove speed up effect.
   *
   * @param {Orb} owner
   * @override
   */
  onUp(owner) {
    owner.removeEffect(this.effect)
    delete this.effect
  }
}

module.exports = SpeedUp