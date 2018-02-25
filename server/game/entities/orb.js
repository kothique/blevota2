const { stamp, compose2 } = require('../../../common/stamp') 
const Entity = require('../entity')
const { ORB } = require('../../../common/entities')
const SpeedUp = require('../effects/speedup')

const Orb = compose2(Entity, stamp({
  /**
   * Initialize the new orb.
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
  init(id, options) {
    this._parent.init.call(this, id, {
      ...options,
      type:      options.type  || ORB,
      mass:      1,
      moveForce: 0.1,
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
  },

  proto: {
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
        this.skill1.effect = SpeedUp.create(0.05)
        this.receiveEffect(this.skill1.effect)
      } else if (!skill1 && this.skill1.prev) {
        this.removeEffect(this.skill1.effect)
        this.skill1.effect = null
      }

      this.skill1.prev = skill1

      this._parent.proto.applyControls.call(this, controls)

      return this
    },

    /**
     * Serialize the orb.
     *
     * @param {Buffer} buffer
     * @param {number} offset
     * @chainable
     * @override
     */
    serialize(buffer, offset = 0) {
      this._parent.proto.serialize.call(this, buffer, offset)
      offset += this._parent.proto.serializedLength.call(this)

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
    },

    /**
     * The size of the orb serialized.
     *
     * @return {number}
     * @override
     */
    serializedLength() {
      return this._parent.proto.serializedLength.call(this) + 8 * 5
    }
  }
}))

module.exports = Orb