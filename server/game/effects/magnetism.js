/**
 * @module server/game/effects/magnetism
 */

const Effect = require('./effect')

const { Vector, V } = require('../../../common/vector')

/**
 * @class
 */
class Magnetism extends Effect {
  /**
   * Create a new magnetism effect.
   *
   * @param {object} options
   * @param {number} options.minValue
   * @param {number} options.maxValue
   * @param {number} options.radius
   * @param {object} effectAPI
   */
  constructor(options, effectAPI) {
    super(options, effectAPI)

    this.minValue = options.minValue
    this.maxValue = options.maxValue
    this.radius   = options.radius
  }

  /**
   * @param {Orb}    target
   * @param {number} t  - Timestamp in seconds.
   * @param {number} dt - Timestep in seconds.
   */
  onTick(target, t, dt) {
    const orbs = this.api.queryBox({
      minP: Vector.subtract(target.position, V(this.radius, this.radius)),
      maxP: Vector     .add(target.position, V(this.radius, this.radius))
    }).map(this.api.getOrb)

    orbs.forEach((orb) => {
      if (orb !== target) {
        const distance = Math.max(0, Vector.distance(target.position, orb.position) - target.radius - orb.radius)

        if (distance <= this.radius && distance > 0) {
          const value = this.minValue + (distance / this.radius * (this.maxValue - this.minValue)),
                force = Vector.subtract(target.position, orb.position).setLength(value)

          orb.force.add(force)
        }
      }
    })
  }
}

module.exports = Magnetism