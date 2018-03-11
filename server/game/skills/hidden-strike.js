/**
 * @module server/game/skills/hidden-strike
 */

const Skill = require('./skill')
const EffectHiddenStrike = require('../effects/hidden-strike')
const { READY, ACTIVE } = require('../../../common/skill-state')

/**
 * @class
 */
class HiddenStrike extends Skill {
  /**
   * Start casting.
   *
   * @param {Orb} owner
   */
  onDown(owner) {
    if (this.state.type === READY && !owner.isVisible()) {
      this.state = { type: ACTIVE }

      this.effect = this.api.createEffect(EffectHiddenStrike, {
        minDamage:       0,
        maxDamage:       30,
        maxCastDuration: 3,
        radius:          200,
        onEnd:           () => {
          this.state = { type: READY }
          delete this.effect
        }
      })

      owner.receiveEffect(this.effect)
    }
  }

  /**
   * End casting.
   *
   * @param {Orb} owner 
   */
  onUp(owner) {
    if (this.state.type === ACTIVE) {
      if (this.effect && this.effect.alive) {
        owner.removeEffect(this.effect)
      }

      this.state = { type: READY }
      delete this.effect
    }
  }
}

module.exports = HiddenStrike