/**
 * @module server/game/skill/pull
 */

const Skill = require('./skill')

const { READY, ACTIVE } = require('../../../common/skill-state')
const { Vector, V }     = require('../../../common/vector')

const MIN_VALUE = 0.05
const MAX_VALUE = 0.15
const RADIUS    = 300

/** @class */
class Magnetism extends Skill {
  /**
   * Apply magnetism.
   *
   * @param {Orb} owner
   * @override
   */
  onDown(owner) {
    this.state = { type: ACTIVE }
  }

  /**
   * @param {Orb}    owner 
   * @param {number} t 
   * @param {number} dt 
   */
  onTick(owner, t, dt) {
    if (this.state.type === ACTIVE) {
      const orbs = this.api.queryBox({
        minP: Vector.subtract(owner.position, V(RADIUS, RADIUS)),
        maxP: Vector     .add(owner.position, V(RADIUS, RADIUS))
      }).map(this.api.getOrb)

      orbs.forEach((orb) => {
        if (orb !== owner) {
          const distance = Math.max(0, Vector.distance(owner.position, orb.position))

          if (distance <= RADIUS && distance > 0) {
            const value = MIN_VALUE + (distance / RADIUS * (MAX_VALUE - MIN_VALUE)),
                  force = Vector.subtract(owner.position, orb.position).setLength(value)

            orb.force.add(force)
          }
        }
      })
    }
  }

  /**
   * Remove magnetism.
   *
   * @param {Orb} owner
   * @override
   */
  onUp(owner) {
    this.state = { type: READY }
  }
}

module.exports = Magnetism