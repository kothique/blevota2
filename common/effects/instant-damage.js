/**
 * @module common/effects/instant-damage
 */

const Effect = require('../effect')

/**
 * @class
 */
class InstantDamage extends Effect {
  /**
   * Create a new instance.
   *
   * @param {number} value - The amount of damage to inflict.
   */
  constructor(value) {
    super()

    this.value = value
  }

  apply(target, dt = 0) {
    target.hp -= this.value

    this.end()
  }
}

module.exports = InstantDamage