/**
 * @module server/game/effects/hidden-strike
 */

const Effect        = require('./effect')
const InstantDamage = require('./instant-damage')
const Invisibility  = require('./invisibility')

const { Vector, V }     = require('../../../common/vector')
const { HIDDEN_STRIKE } = require('../../../common/effects')
const { ORB }           = require('../../../common/entities')

/**
 * @class
 */
class HiddenStrike extends Effect {
  /**
   * Create a new hidden-strike effect.
   *
   * @param {object}   options
   * @param {number}   options.minDamage
   * @param {number}   options.maxDamage
   * @param {number}   options.maxCastDuration
   * @param {function} options.onEnd
   * @param {number}   radius
   * @param {object}   effectAPI
   */
  constructor(options, effectAPI) {
    super(options, effectAPI)

    this.minDamage       = options.minDamage
    this.maxDamage       = options.maxDamage
    this.maxCastDuration = options.maxCastDuration
    this.radius          = options.radius
    this.onEnd           = options.onEnd
  }

  /**
   * Start casting.
   */
  onReceive(target) {
    this.duration = 0
    target.casting = true
  }

  /**
   * @param {Entity} target
   * @param {number} t
   * @param {number} dt
   */
  onTick(target, t, dt) {
    this.duration += dt

    if (this.duration >= this.maxCastDuration || target.visible) {
      this.die()
    }
  }

  /**
   * Inflict damage.
   *
   * @param {Entity} target
   */
  onRemove(target) {
    target.casting = false
    this.onEnd()

    if (!target.visible) {
      target.effects.forEach((effect) => {
        if (effect instanceof Invisibility) {
          target.removeEffect(effect)
        }
      })

      const entities = this.api.queryBox({
        minP: Vector.subtract(target.position, V(this.radius, this.radius)),
        maxP: Vector.     add(target.position, V(this.radius, this.radius))
      }).map(this.api.getEntity)

      entities.forEach((entity) => {
        if (entity.type === ORB && entity !== target) {
          const k = Math.max(1, this.duration / this.maxCastDuration),
                value = this.minDamage + k * (this.maxDamage - this.minDamage)

          entity.receiveEffect(this.api.createEffect(InstantDamage, { value }))
        }
      })
    }
  }

  /**
   * Write the effect to a buffer.
   *
   * @param {Buffer}  buffer
   * @param {?number} offset
   * @chainable
   */
  serialize(buffer, offset = 0) {
    super.serialize(buffer, offset)
    offset += super.binaryLength

    buffer.writeUInt8(HIDDEN_STRIKE, offset)
    offset += 1

    const progress = Math.floor(this.duration / this.maxCastDuration * 100)

    buffer.writeUInt8(progress, offset)
    offset += 1

    return this
  }

  /**
   * The size of the effect sreialized.
   */
  get binaryLength() {
    return super.binaryLength + 1 + 1
  }
}

module.exports = HiddenStrike