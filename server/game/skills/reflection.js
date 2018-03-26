/**
 * @module server/game/skills/reflection
 */

const Skill = require('./skill')

const { ACTIVE, READY } = require('../../../common/skill-state')

const RADIUS            = 200
const MAX_CAST_DURATION = 3
const DAMAGE_GET        = 0.5

/** @class */
class Reflection extends Skill {
  constructor(options, skillAPI) {
    super(options, skillAPI)

    this.duration = 0
    this.absorbed = 0
    this.progress = 0

    this.onDamage = this.onDamage.bind(this)
  }

  onDamage(value, source) {
    this.absorbed += value
  }

  onDown(owner) {
    if (this.state.type === READY) {
      this.state = { type: ACTIVE }

      this.duration = 0
      this.absorbed = 0
      this.progress = 0

      owner.damageImmune = true
      owner.on('damage', this.onDamage)
    }
  }

  onTick(owner, t, dt) {
    if (this.state.type === ACTIVE) {
      this.duration += dt

      this.progress = DAMAGE_GET * this.absorbed / owner.hp

      if (this.duration >= MAX_CAST_DURATION) {
        this.release(owner)
      }
    }
  }

  release(owner) {
    this.state = { type: READY }

    const orbs   = this.api.getOrbsInCircle({ centerP: owner.position, radius: RADIUS })

    orbs.forEach(orb => {
      if (orb !== owner) {
        orb.hurt(this.absorbed / (orbs.length - 1), owner)
      }
    })

    owner.damageImmune = false
    owner.removeListener('damage', this.onDamage)
    owner.hurt(DAMAGE_GET * this.absorbed, owner)
  }

  onUp(owner) {
    if (this.state.type === ACTIVE) {
      this.release(owner)
    }
  }

  serializeForOrb(buffer, offset = 0) {
    buffer.writeUInt8(this.state.type === ACTIVE,       offset++)

    buffer.writeUInt16BE(RADIUS, offset)
    offset += 2

    buffer.writeUInt8(Math.min(1, this.progress) * 255, offset++)
  }

  get binaryLengthForOrb() { return 1 + 2 + 1 }
}

module.exports = Reflection