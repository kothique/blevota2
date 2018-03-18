/**
 * @module server/game/effects/slowdown
 */
const Effect = require('./effect')

/**
 * @class
 */
class SlowDown extends Effect {
  /**
   * Create a new slow down effect.
   *
   * @param {object} options
   * @param {number} options.value - Added to the target's drag force factor.
   * @param {object} effectAPI
   */
  constructor(options, effectAPI) {
    super(options, effectAPI)

    this.value = options.value
  }

  /**
   * Increase the target's drag force factor.
   *
   * @param {Orb} target
   */
  onReceive(target) {
    target.dragForceFactor += this.value
  }

  /**
   * Decrease the target's drag force factor back.
   *
   * @param {Orb} target
   */
  onRemove(target) {
    target.dragForceFactor -= this.value
  }
}

module.exports = SlowDown
