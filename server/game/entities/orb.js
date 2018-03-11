/**
 * @module server/game/entities/orb
 */

 const forIn = require('lodash/forIn')

const SkillManager = require('../skill-manager')
const Entity       = require('./entity')
const { ORB }      = require('../../../common/entities')
const SpeedUp      = require('../skills/speedup')
const SlowDown     = require('../skills/slowdown')
const Pull         = require('../skills/pull')
const Push         = require('../skills/push')
const Invisibility = require('../skills/invisibility')
const HiddenStrike = require('../skills/hidden-strike')

const { Vector, V } = require('../../../common/vector')

/**
 * @class
 */
class Orb extends Entity {
  /**
   * Create a new orb.
   *
   * @param {object}   options
   * @param {number}   options.radius
   * @param {number}   options.maxHp  - Maximum health points.
   * @param {number}   options.hp     - Current health points.
   * @param {number}   options.maxMp  - Maximum mana points.
   * @param {number}   options.mp     - Current mana points.
   */
  constructor(options, entityAPI) {
    super({
      ...options,
      mass: 1,
      moveForce: 0.1
    }, entityAPI)

    this.radius = options.radius || 30
    this.maxHp  = options.maxHp
    this.hp     = options.hp
    this.maxMp  = options.maxMp
    this.mp     = options.mp

    /* Don't forget to change client/Orb#parse when adding new skills */
    this.skillManager = new SkillManager(this, {
      skill1: this.api.createSkill(SpeedUp),
      skill2: this.api.createSkill(SlowDown),
      skill3: this.api.createSkill(Pull),
      skill4: this.api.createSkill(Push),
      skill5: this.api.createSkill(Invisibility),
      skill6: this.api.createSkill(HiddenStrike)
    })

    this._alive     = true
    this._invisible = 0
    this.casting   = false
    this.effects   = []
  }

  /**
   * Handle skills and set forces according to controls.
   *
   * @param {object} controls
   * @chainable
   */
  applyControls(controls) {
    const { pX, pY, move } = controls

    this.skillManager.handleControls(controls)

    if (move && this.moveForce && !this.casting) {
      this.force.add(
        V(pX, pY).subtract(this.position).setLength(this.moveForce)
      )
    }

    return this
  }

  /**
   * Receive an effect.
   *
   * @param {Effect} effect
   * @chainable
   */
  receiveEffect(effect) {
    this.effects.push(effect)
    effect.onReceive(this)

    return this
  }

  /**
   * Remove the specified effect.
   *
   * @param {Effect} effect
   * @chainable
   */
  removeEffect(effect) {
    const index = this.effects.indexOf(effect)
    if (index !== -1) {
      effect.onRemove(this)
      this.effects.splice(index, 1)
    }

    return this
  }

  /**
   * Make sure hp and mp >= 0 after effects are applied.
   *
   * @param {number} t
   * @param {number} dt
   * @chainable
   * @override
   */
  applyEffects(t, dt) {
    this.effects.forEach((effect) => {
      effect.onTick(this, t, dt)

      if (effect.alive === false) {
        this.removeEffect(effect)
      }
    })

    if (this.hp < 0) {
      this.hp = 0
    }

    if (this.mp < 0) {
      this.mp = 0
    }
  }

  /**
   * Serialize the orb.
   *
   * @param {Buffer} buffer
   * @param {number} offset
   * @chainable
   * @override
   */
  serialize(buffer, offset = 0) {
    super.serialize(buffer, offset)
    offset += super.binaryLength

    buffer.writeDoubleBE(this.radius, offset)
    offset += 8

    buffer.writeDoubleBE(this.maxHp, offset)
    offset += 8

    buffer.writeDoubleBE(this.hp, offset)
    offset += 8

    buffer.writeDoubleBE(this.maxMp, offset)
    offset += 8

    buffer.writeDoubleBE(this.mp, offset)
    offset += 8

    buffer.writeUInt8(this.visible, offset++)

    return this
  }

  /**
   * The size of the orb serialized.
   *
   * @return {number}
   * @override
   */
  get binaryLength() {
    return super.binaryLength + 8 * 5 + 1
  }

  /**
   * Write the states of the orb's skills to a buffer.
   *
   * @param {Buffer} buffer
   * @param {number} offset
   * @chainable
   */
  serializeSkills(buffer, offset = 0) {
    const skills = this.skillManager.skills

    forIn(this.skillManager.skills, (skill) => {
      skill.serialize(buffer, offset)
      offset += skill.binaryLength
    })

    return this
  }

  /**
   * The size of the orb's skills serialized.
   *
   * @return {number}
   */
  serializedSkillsLength() {
    let length = 0

    forIn(this.skillManager.skills, (skill) => {
      length += skill.binaryLength
    })
    
    return length
  }

  /**
   * Create a new buffer with skills written to it.
   *
   * @return {Buffer}
   */
  skillsToBuffer() {
    const buffer = Buffer.allocUnsafe(this.serializedSkillsLength())
    this.serializeSkills(buffer)

    return buffer
  }

  /**
   * Mark the entity as dead.
   *
   * @chainable
   */
  die() {
    this._alive = false

    return this
  }

  get alive() {
    return this._alive
  }

  get visible() {
    return this._invisible === 0
  }

  // get casting() {
  //   return this._casting
  // }

  get type() {
    return ORB
  }
}

module.exports = Orb