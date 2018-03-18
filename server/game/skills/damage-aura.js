/**
 * @module server/game/skills/damage-aura
 */

const Skill = require('./skill')

const { READY, ACTIVE } = require('../../../common/skill-state')
const { Vector, V }     = require('../../../common/vector')

const RADIUS = 200
const DAMAGE = 0.2

/**
 * @class
 */
class DamageAura extends Skill {
  onDown(owner) {
    if (this.state.type === READY) {
      this.state = { type: ACTIVE }
    }
  }

  onTick(owner, t, dt) {
    if (this.state.type === ACTIVE) {
      const orbs = this.api.queryBox({
        minP: Vector.subtract(owner.position, V(RADIUS, RADIUS)),
        maxP: Vector.add(owner.position, V(RADIUS, RADIUS))
      }).map(this.api.getOrb)

      orbs.forEach((orb) => {
        if (orb !== owner) {
          orb.hurt(DAMAGE, owner)
        }
      })
    }
  }

  onUp(owner) {
    if (this.state.type === ACTIVE) {
      this.state = { type: READY }
    }
  }
}

module.exports = DamageAura