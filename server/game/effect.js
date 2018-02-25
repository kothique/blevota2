const { stamp } = require('../../common/stamp')

const Effect = stamp({
  /**
   * Initialize the new effect.
   * @constructor
   */
  init() {
    this.alive = true
  },

  proto: {
    /**
     * Called when the effect is received by some entity.
     *
     * @param {Entity} target
     */
    onReceive(target) {},

    /**
     * Called when integrating the physics.
     *
     * @param {Entity} target
     * @param {number} t
     * @param {number} dt
     */
    onTick(target, t, dt) {},

    /**
     * Called when removed from its entity.
     *
     * @param {Entity} target
     */
    onRemove(target) {},

    /**
     * Mark the effect as to be removed at the next tick.
     *
     * @chainable
     */
    die() {
      this.alive = false

      return true
    },

    /**
     * Write the effect to a buffer.
     *
     * @param {Buffer} buffer
     * @param {number} offset
     * @chainable
     */
    serialize(buffer, offset = 0) {
      return this
    },

    /**
     * Size in bytes that the effect takes when serialized.
     *
     * @return {number}
     */
    serializedLength() {
      return 0
    }
  }
})

module.exports = Effect