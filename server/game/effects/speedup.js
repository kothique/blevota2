/**
 * @module server/game/effects/speedup
 */
const Effect = require('./effect')

/**
 * @class
 */
class SpeedUp extends Effect {
  /**
   * Create a new speedup effect.
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
   * Increase the target's movement force.
   *
   * @param {Orb} target
   */
  onReceive(target) {
    target.dragForceFactor -= this.value
  }

  /**
   * Decrease the target's movement force back.
   *
   * @param {Orb} target
   */
  onRemove(target) {
    target.dragForceFactor += this.value
  }
}

module.exports = SpeedUp