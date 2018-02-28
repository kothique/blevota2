/**
 * @module server/game/entities/orb
 */
const Entity = require('../entity')
const { ORB } = require('../../../common/entities')
const SpeedUp = require('../effects/speedup')

/**
 * @class
 */
class Orb extends Entity {
  /**
   * Create a new orb.
   *
   * @param {string}   id
   * @param {object}   options
   * @param {?number}  options.type
   * @param {number}   options.radius
   * @param {number}   options.maxHp  - Maximum health points.
   * @param {number}   options.hp     - Current health points.
   * @param {number}   options.maxMp  - Maximum mana points.
   * @param {number}   options.mp     - Current mana points.
   */
  constructor(id, options) {
    super(id, {
      ...options,

      type: options.type || ORB,
      mass: 1,
      moveForce: 0.1
    })

    this.radius = options.radius || 30
    this.maxHp  = options.maxHp
    this.hp     = options.hp
    this.maxMp  = options.maxMp
    this.mp     = options.mp

    this.skill1 = {
      prev: false,
      effect: null
    }
  }

  /**
   * Handle skills.
   *
   * @param {object} controls
   * @chainable
   * @override
   */
  applyControls(controls) {
    const { skill1 } = controls

    if (skill1 && !this.skill1.prev) {
      this.skill1.effect = new SpeedUp(0.2)
      this.receiveEffect(this.skill1.effect)
    } else if (!skill1 && this.skill1.prev) {
      this.removeEffect(this.skill1.effect)
      this.skill1.effect = null
    }

    this.skill1.prev = skill1

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
}

module.exports = Orb