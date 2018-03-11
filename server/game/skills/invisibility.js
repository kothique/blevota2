/**
 * @module server/game/skills/invisibility
 */

const Skill = require('./skill')
const EffectInvisibility = require('../effects/invisibility')

const { READY, ACTIVE } = require('../../../common/skill-state')

/**
 * @class
 */
class Invisibility extends Skill {
  onDown(owner) {
    if (this.state.type === READY) {
      this.state = { type: ACTIVE }

      this.effect = this.api.createEffect(EffectInvisibility)
      owner.receiveEffect(this.effect)
    }
  }

  onUp(owner) {
    if (this.state.type === ACTIVE) {
      this.state = { type: READY }

      owner.removeEffect(this.effect)
      delete this.effect
    }
  }
}

module.exports = Invisibility