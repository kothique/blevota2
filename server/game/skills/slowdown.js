/**
 * @module server/game/skill/slowdown
 */

const Skill = require('./skill')
const EffectSlowDown = require('../effects/slowdown')

class SlowDown extends Skill {
  /**
   * Apply slow down effect.
   *
   * @param {Orb} owner
   * @override
   */
  onDown(owner) {
    this.effect = new EffectSlowDown(10)
    owner.receiveEffect(this.effect)
  }

  /**
   * Remove slow down effect.
   *
   * @param {Orb} owner
   * @override
   */
  onUp(owner) {
    owner.removeEffect(this.effect)
    delete this.effect
  }
}

module.exports = SlowDown