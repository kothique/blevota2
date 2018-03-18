/**
 * @module server/game/orbs/orb
 */

const forIn = require('lodash/forIn')

const SkillManager = require('../skill-manager')

const { Vector, V }         = require('../../../common/vector')
const { ORBS: { UNKNOWN } } = require('../../../common/const')

/** @class */
class Orb {
  constructor(options, orbAPI) {
    this.api = orbAPI

    this.mass            = options.mass
    this.moveForce       = options.moveForce       || 0.1
    this.dragForceFactor = options.dragForceFactor || 1
    this.position        = options.position        || V(0, 0)
    this.velocity        = options.velocity        || V(0, 0)
    this.force           = options.force           || V(0, 0)

    this.radius   = options.radius
    this.maxHP    = options.maxHP
    this._hp      = options.hp
    this._visible = true
    this._shield  = 0

    this.effects  = []

    this.skills       = options.skills || {}
    this.skillManager = new SkillManager(this, this.skills)
  }

  applyControls(controls) {
    const { pX, pY, move } = controls

    this.skillManager.handleControls(controls)

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
    forIn(this.skills, (skill) => {
      skill.onTick(this, t, dt)
    })

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
  }

  get binaryLength() { return 8 * 5 + 1 }

  skillsToBuffer() {
    const buffer = Buffer.allocUnsafe(this.skillsBinaryLength)
    let offset = 0

    forIn(this.skills, (skill) => {
      skill.serialize(buffer, offset)
      offset += skill.binaryLength
    })

    return buffer
  }

  get skillsBinaryLength() {
    let length = 0

    forIn(this.skills, (skill) => {
      length += skill.binaryLength
    })

    return length
  }

  get type() { return UNKNOWN }

  get alive() { return this.hp > 0 }

  get visible() { return this._visible }

  set visible(nextVisible) { this._visible = nextVisible }

  hide() { this.visible = false }
  show() { this.visible = true }

  _setHpBy(nextHP, source = null) {
    this._hp = nextHP
    if (this._hp <= 0) {
      this._hp = 0
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
}

module.exports = Orb