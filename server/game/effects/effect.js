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
}

module.exports = Effect