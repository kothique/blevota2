/**
 * @module server/game/effect
 */

/**
 * @class
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
   * Called when the effect is received by some orb.
   *
   * @param {Orb} target
   * @virtual
   */
  onReceive(target) {
    // does nothing
  }

  /**
   * Called when integrating the physics.
   *
   * @param {Orb} target
   * @param {number} t
   * @param {number} dt
   * @virtual
   */
  onTick(target, t, dt) {
    // does nothing
  }

  /**
   * Called when removed from its orb.
   *
   * @param {Orb} target
   * @virtual
   */
  onRemove(target) {
    // does nothing
  }

  /**
   * Mark the effect to be removed.
   */
  die() {
    this.alive = false
  }
}

module.exports = Effect