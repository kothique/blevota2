/**
 * @module server/game/effect
 */

/**
 * @class
 * @abstract
 */
class Effect {
  /**
   * Create a new effect.
   * 
   * @param {any}    options
   * @param {object} effectAPI
   */
  constructor(options, effectAPI) {
    this.alive = true
    this.api = effectAPI
  }

  /**
   * Called when the effect is received by some entity.
   *
   * @param {Entity} target
   */
  onReceive(target) {
    // does nothing
  }

  /**
   * Called when integrating the physics.
   *
   * @param {Entity} target
   * @param {number} t
   * @param {number} dt
   */
  onTick(target, t, dt) {
    // does nothing
  }

  /**
   * Called when removed from its entity.
   *
   * @param {Entity} target
   */
  onRemove(target) {
    // does nothing
  }

  /**
   * Mark the effect to be removed at the next tick.
   *
   * @chainable
   */
  die() {
    this.alive = false

    return true
  }

  /**
   * Write the effect to a buffer.
   *
   * @param {Buffer} buffer
   * @param {number} offset
   * @chainable
   */
  serialize(buffer, offset = 0) {
    return this
  }

  /**
   * Size in bytes that the effect takes when serialized.
   *
   * @return {number}
   */
  serializedLength() {
    return 0
  }
}

module.exports = Effect