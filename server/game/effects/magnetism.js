/**
 * @module server/game/effects/magnetism
 */

const Effect = require('./effect')

const { MAGNETISM } = require('../../../common/effects')
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
   * @param {Entity} target
   * @param {number} t  - Timestamp in seconds.
   * @param {number} dt - Timestep in seconds.
   */
  onTick(target, t, dt) {
    const entities = this.api.queryBox({
      minP: Vector.subtract(target.position, V(this.radius, this.radius)),
      maxP: Vector     .add(target.position, V(this.radius, this.radius))
    }).map(this.api.getEntity)

    entities.forEach((entity) => {
      if (entity.radius && entity !== target) {
        const orb = entity,
              distance = Math.max(0, Vector.distance(target.position, orb.position) - target.radius - orb.radius)

        if (distance <= this.radius && distance > 0) {
          const value = this.minValue + (distance / this.radius * (this.maxValue - this.minValue)),
                force = Vector.subtract(target.position, orb.position).setLength(value)

          orb.force.add(force)
        }
      }
    })
  }

  /**
   * Write the effect to a buffer.
   *
   * @param {Buffer} buffer
   * @param {number} offset
   * @chainable
   */
  serialize(buffer, offset = 0) {
    super.serialize(buffer, offset)
    offset += super.serializedLength()

    buffer.writeUInt8(MAGNETISM, offset)
    offset += 1

    buffer.writeDoubleBE(this.minValue, offset)
    offset += 8

    buffer.writeDoubleBE(this.maxValue, offset)
    offset += 8

    buffer.writeDoubleBE(this.radius, offset)
    offset += 8

    return this
  }

  /**
   * Return the size of the effect serialized.
   *
   * @return {number}
   */
  serializedLength() {
    return super.serializedLength() + 1 + 3 * 8
  }
}

module.exports = Magnetism