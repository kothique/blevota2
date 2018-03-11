/**
 * @module server/game/skills/hidden-strike
 */

const Skill = require('./skill')

const { READY, ACTIVE } = require('../../../common/skill-state')
const { Vector, V } = require('../../../common/vector')
const { ORB } = require('../../../common/entities')

const MIN_DAMAGE = 0
const MAX_DAMAGE = 30
const MAX_CAST_DURATION = 3
const RADIUS = 200

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
    if (this.state.type === READY && !owner.visible) {
      this.state = { type: ACTIVE }
      this.duration = 0
      owner.casting = true
    }
  }

  onTick(owner, t, dt) {
    if (this.state.type === ACTIVE) {
      this.duration += dt

      if (this.duration >= MAX_CAST_DURATION || owner.visible) {
        this.state = { type: READY }
        this.release(owner)
        owner.casting = false
      }
    }
  }

  /**
   * End casting.
   *
   * @param {Orb} owner 
   */
  onUp(owner) {
    if (this.state.type === ACTIVE) {
      this.state = { type: READY }
      this.release(owner)
      owner.casting = false
    }
  }

  release(owner) {
    this.state = { type: READY }
    owner.casting = false

    if (!owner.visible) {
      owner.show()

      const entities = this.api.queryBox({
        minP: Vector.subtract(owner.position, V(RADIUS, RADIUS)),
        maxP: Vector.add(owner.position, V(RADIUS, RADIUS))
      }).map(this.api.getEntity)

      entities.forEach((entity) => {
        if (entity.type === ORB && entity !== owner) {
          const k = Math.max(1, this.duration / MAX_CAST_DURATION),
                value = MIN_DAMAGE + k * (MAX_DAMAGE - MIN_DAMAGE)

          entity.receiveDamage(value, owner)
        }
      })
    }
  }
}

module.exports = HiddenStrike