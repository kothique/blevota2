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
   * Create a new hidden strike skill.
   *
   * @param {object} options
   * @param {object} skillAPI
   */
  constructor(options, skillAPI) {
    super(options, skillAPI)

    this.clear()
  }

  /**
   * Start casting.
   *
   * @param {Orb} owner
   */
  onDown(owner) {
    if (this.state.type === READY) {
      this.state = { type: ACTIVE }

      this.effect = this.api.createEffect(EffectHiddenStrike, {
        minDamage:       5,
        maxDamage:       40,
        maxCastDuration: 0.8,
        radius:          200,
        onEnd:           this.clear.bind(this)
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
    if (this.state.type === ACTIVE && this.effect && this.effect.alive) {
      this.effect.die()
      this.clear()
    }
  }

  /**
   * Return the skill to its default state.
   */
  clear() {
    this.state  = { type: READY }
    this.effect = null
  }
}

module.exports = HiddenStrike