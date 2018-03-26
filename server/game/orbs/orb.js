/**
 * @module server/game/orbs/orb
 */

const EventEmitter = require('events')

const SkillManager = require('../skill-manager')

const { Vector, V }         = require('../../../common/vector')
const { ORBS: { UNKNOWN } } = require('../../../common/const')

/** @class */
class Orb extends EventEmitter {
  constructor(options, orbAPI) {
    super()

    this.api = orbAPI

    this.mass            = options.mass
    this.moveForce       = options.moveForce       || 0.05
    this.dragForceFactor = options.dragForceFactor || 1
    this.position        = options.position        || V(0, 0)
    this.velocity        = options.velocity        || V(0, 0)
    this.force           = options.force           || V(0, 0)

    this.radius        = options.radius
    this.maxHP         = options.maxHP
    this._hp           = options.hp
    this._invisible    = 0
    this._revealed     = 0
    this._shield       = 0
    this._damageImmune = 0
    this._spellImmune  = 0

    this.effects  = []

    this.skillManager = new SkillManager(this)
  }

  applyControls(controls) {
    const { pX, pY, move, attack, skills } = controls

    this.skillManager.handleControls({ attack, skills })

    if (move && this.moveForce) {
      this.force.add(
        V(pX, pY).subtract(this.position).setLength(this.moveForce)
      )
    }
  }

  receiveEffect(effect) {
    this.effects.push(effect)
    effect.onReceive(this)
  }

  removeEffect(effect) {
    const index = this.effects.indexOf(effect)
    if (index !== -1) {
      effect.onRemove(this)
      this.effects.splice(index, 1)
    }
  }

  applyEffects(t, dt) {
    this.skillManager.tickSkills(t, dt)

    this.revealed = false

    this.effects.forEach((effect) => {
      effect.onTick(this, t, dt)

      if (effect.alive === false) {
        this.removeEffect(effect)
      }
    })
  }

  integrate(t, dt) {
    const dragForce = this.velocity.clone()
      .setLength(-0.001 * this.dragForceFactor * this.velocity.length() ** 2)

    this.force.add(dragForce)
    this.acceleration = Vector.divide(this.force, this.mass)
    this.velocity.add(this.acceleration)
    this.position.add(this.velocity)
  }

  serialize(buffer, offset = 0) {
    buffer.writeDoubleBE(this.position.x, offset)
    offset += 8

    buffer.writeDoubleBE(this.position.y, offset)
    offset += 8

    buffer.writeDoubleBE(this.radius, offset)
    offset += 8

    buffer.writeDoubleBE(this.maxHP, offset)
    offset += 8

    buffer.writeDoubleBE(this.hp, offset)
    offset += 8

    buffer.writeUInt8(this.visible, offset++)

    this.skillManager.serializeForOrb(buffer, offset)
    offset += this.skillManager.binaryLengthForOrb
  }

  get binaryLength() { return 8 * 5 + 1 + this.skillManager.binaryLengthForOrb }

  skillsToBuffer() {
    const buffer = Buffer.allocUnsafe(this.skillManager.binaryLengthForSkillBox)
    this.skillManager.serializeForSkillBox(buffer)

    return buffer
  }

  get skillsBinaryLength() { return this.skillManager.binaryLengthForSkillBox }

  get type() { return UNKNOWN }

  get alive() { return this.hp > 0 }

  get visible() { return this._invisible === 0 }

  set visible(nextVisible) {
    if (nextVisible && !this.visible) {
      this.emit('show')
    } else if (!nextVisible && this.visible) {
      this.emit('hide')
    }

    nextVisible ? this._invisible-- : this._invisible++

    if (this._invisible < 0)
      this._invisible = 0
  }

  hide() { this.visible = false }
  show() { this.visible = true }

  _setHpBy(nextHP, source = null) {
    if (nextHP > this._hp) {
      this.emit('heal', nextHP - this._hp, source)
    } else if (nextHP < this._hp) {
      this.emit('damage', this._hp - nextHP, source)

      if (this.damageImmune) return
    }

    if (nextHP > 0 && this._hp <= 0) {
      this.emit('resurrection', source)
    } else if (nextHP <= 0 && this._hp > 0) {
      this.emit('death', source)
    }

    this._hp = nextHP
    if (this._hp < 0) {
      this._hp = 0
    }
    if (this._hp > this.maxHP) {
      this._hp = this.maxHP
    }
  }

  get hp() { return this._hp }

  set hp(nextHP) { this._setHpBy(nextHP, null) }

  hurt(value, source = null) {
    value *= 1 - this._shield

    this._setHpBy(this._hp - value, source)
  }

  heal(value, source = null) {
    this._setHpBy(this._hp + value, source)
  }

  get shield() { return this._shield }

  set shield(nextShield) { this._shield = nextShield }

  get damageImmune() { return this._damageImmune > 0 }

  set damageImmune(nextDamageImmune) {
    nextDamageImmune ? this._damageImmune++ : this._damageImmune--

    if (this._damageImmune < 0)
      this._damageImmune = 0
  }

  get spellImmune() { return this._spellImmune }

  set spellImmune(nextSpellImmune) {
    nextSpellImmune ? this._spellImmune++ : this._spellImmune--

    if (this._spellImmune < 0)
      this._spellImmune = 0
  }

  get revealed() { return this._revealed > 0 }

  set revealed(nextRevealed) {
    nextRevealed ? this._revealed++ : this._revealed--

    if (this._revealed < 0)
      this._revealed = 0
  }
}

module.exports = Orb