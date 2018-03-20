/**
 * @module server/game/skills/attack
 */

const Skill = require('./skill')

const { READY, ACTIVE } = require('../../../common/skill-state')
const { Vector, V }     = require('../../../common/vector')

const CYCLE_DURATION = 0.5
const MAX_RADIUS     = 300
const DAMAGE         = 30

/** @class */
class Attack extends Skill {
  constructor(options, skillAPI) {
    super(options, skillAPI)

    this.timer = 0
  }

  onDown(owner) {
    this.state = { type: ACTIVE }
  }

  onTick(owner, t, dt) {
    if (this.state.type === ACTIVE) {
      this.timer += dt

      if (this.timer > CYCLE_DURATION) {
        this.timer = 0
      }

      const radius = this.timer / CYCLE_DURATION * MAX_RADIUS,
            orbs = this.api.queryBox({
              minP: Vector.subtract(owner.position, V(radius, radius)),
              maxP: Vector     .add(owner.position, V(radius, radius))
            }).map(this.api.getOrb)

      orbs.forEach((orb) => {
        if (orb !== owner) {
          const distance = Vector.distance(owner.position, orb.position)

          if (Math.abs(distance - radius) < orb.radius) {
            orb.hurt(DAMAGE * dt, owner)
          }
        }
      })
    }
  }

  onUp(owner) {
    this.state = { type: READY }
  }
}

module.exports = Attack