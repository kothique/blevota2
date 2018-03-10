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
      skill4: this.api.createSkill(Push)
    })

    this.alive = true
  }

  /**
   * Return the type of the entity.
   *
   * @return {number}
   */
  static getType() {
    return ORB
  }

  /**
   * Handle skills.
   *
   * @param {object} controls
   * @chainable
   * @override
   */
  applyControls(controls) {
    this.skillManager.handleControls(controls)
    super.applyControls(controls)

    return this
  }

  /**
   * Make sure hp and mp >= 0 after effects are applied.
   *
   * @chainable
   * @override
   */
  applyEffects() {
    super.applyEffects()

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
    offset += super.serializedLength()

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

    return this
  }

  /**
   * The size of the orb serialized.
   *
   * @return {number}
   * @override
   */
  serializedLength() {
    return super.serializedLength() + 8 * 5
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
      offset += skill.serializedLength()
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
      length += skill.serializedLength()
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
    this.alive = false

    return this
  }
}

module.exports = Orb