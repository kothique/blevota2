/**
 * @module server/game/skills/hidden-strike
 */

const Skill = require('./skill')

const { READY, ACTIVE } = require('../../../common/skill-state')
const { Vector, V } = require('../../../common/vector')

const MIN_DAMAGE = 0
const MAX_DAMAGE = 30
const MAX_CAST_DURATION = 3
const RADIUS = 200

/**
 * @class
 */
class HiddenStrike extends Skill {
  constructor(options, skillAPI) {
    super(options, skillAPI)

    this.duration = 0
    this.targets  = []
  }

  /**
   * Start casting.
   *
   * @param {Orb} owner
   */
  onDown(owner) {
    if (this.state.type === READY && !owner.visible) {
      this.state    = { type: ACTIVE }

      this.duration = 0
      this.targets  = []
    }
  }

  onTick(owner, t, dt) {
    if (this.state.type === ACTIVE) {
      this.duration += dt

      if (this.duration >= MAX_CAST_DURATION || owner.visible) {
        this.release(owner)
      } else {
        this.setTargets(owner)
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
      this.release(owner)
    }
  }

  release(owner) {
    this.state = { type: READY }

    if (!owner.visible) {
      owner.show()

      this.api.getOrbsInCircle({ centerP: owner.position, radius:  RADIUS })
        .forEach(orb => {
          if (orb !== owner) {
            const k     = Math.max(1, this.duration / MAX_CAST_DURATION),
                  value = MIN_DAMAGE + k * (MAX_DAMAGE - MIN_DAMAGE)

            orb.hurt(value, owner)
          }
        })
    }
  }

  setTargets(owner) {
    this.targets = []
    this.api.getOrbsInCircle({ centerP: owner.position, radius: RADIUS })
      .forEach(orb => { if (orb !== owner && orb.visible) this.targets.push(orb.id) })
  }

  serializeForOrb(buffer, offset = 0) {
    buffer.writeUInt8(this.state.type === ACTIVE, offset++)

    buffer.writeUInt8(Math.min(255, this.targets.length), offset++)
    this.targets.forEach(id => {
      buffer.writeUInt16BE(id, offset)
      offset += 2
    })
  }

  get binaryLengthForOrb() { return 1 + 1 + Math.min(255, this.targets.length) * 2 }
}

module.exports = HiddenStrike