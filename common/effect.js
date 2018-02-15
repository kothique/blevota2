/**
 * @module common/effect
 */

/**
 * @class
 */
class Effect {
  constructor() {
    this.alive = true
  }

  /**
   * Apply the effect to the target.
   *
   * @param {entity} target
   * @param {?number} dt - Timestep.
   */
  apply(target, dt = 0) {}

  /**
   * Inform that the effect's action is over.
   */
  end() {
    this.alive = false
  }
}

module.exports = Effect