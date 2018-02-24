const Set = require('collections/set')

const { ENTITY } = require('../../common/entities')
const { stamp } = require('../../common/stamp')
const { V, Vector } = require('../../common/vector')

const Entity = stamp({
  /**
   * Initialize the new entity.
   *
   * @param {string}   id
   * @param {object}   options
   * @param {?number}  options.type
   * @param {number}   options.radius
   * @param {number}   options.mass
   * @param {?number}  options.moveForce
   * @param {?Vector}  options.position
   * @param {?Vector}  options.velocity
   * @param {?Vector}  options.force
   */
  init(id, options) {
    this.id         = id
    this.type       = options.type         || ENTITY
    this.radius     = options.radius
    this.mass       = options.mass
    this.moveForce  = options.moveForce    || 0
    this.position   = options.position     || V(0, 0)
    this.velocity   = options.velocity     || V(0, 0)
    this.force      = options.force        || V(0, 0)
    this.effects    = new Set
  },

  proto: {
    /**
     * Set forces according to controls.
     *
     * @param {object} controls
     * @chainable
     */
    applyControls(controls) {
      const { pX, pY, move } = controls

      if (move && this.moveForce) {
        this.force.add(
          V(pX, pY).subtract(this.position).setLength(this.moveForce)
        )
      }

      return this
    },

    /**
     * Receive an effect.
     *
     * @param {Effect} effect
     * @chainable
     */
    receiveEffect(effect) {
      this.effects.add(effect)
      effect.onReceive(this)

      return this
    },

    /**
     * Remove the specified effect.
     *
     * @param {Effect} effect
     * @chainable
     */
    removeEffect(effect) {
      effect.onRemove(this)
      this.effects.remove(effect)

      return this
    },

    /**
     * Apply the entity's effects.
     *
     * @param {number} t - Timestamp.
     * @param {number} dt - Timestep.
     * @chainable
     */
    applyEffects(t, dt) {
      this.effects.forEach((effect) => {
        effect.onTick(this, t, dt)

        if (effect.alive === false) {
          this.removeEffect(effect)
        }
      })

      return this
    },

    /**
     * Advance the physics of the entity by the timestep `dt`.
     * It uses semi-implicit Euler method.
     *
     * @param {number} t - Timestamp in seconds.
     * @param {number} dt - Timestep in seconds.
     * @chainable
     */
    integrate(t, dt) {
      const dragForce = this.velocity.clone()
        .setLength(-0.001 * this.velocity.length() ** 2)

      this.force.add(dragForce)
      this.acceleration = Vector.divide(this.force, this.mass)
      this.velocity.add(this.acceleration)
      this.position.add(this.velocity)

      return this
    },

    /**
     * Write the entity to a buffer.
     *
     * @param {Buffer} buffer
     * @param {number} offset
     * @chainable
     */
    serialize(buffer, offset = 0) {
      buffer.writeUInt8(this.type, offset)
      offset += 1

      buffer.write(this.id, offset, offset + 24)
      offset += 24

      buffer.writeDoubleBE(this.radius, offset)
      offset += 8

      buffer.writeDoubleBE(this.mass, offset)
      offset += 8

      buffer.writeDoubleBE(this.moveForce, offset)
      offset += 8

      buffer.writeDoubleBE(this.position.x, offset)
      offset += 8

      buffer.writeDoubleBE(this.position.y, offset)
      offset += 8

      buffer.writeUInt8(this.effects.length, offset)
      offset += 1

      this.effects.forEach((effect) => {
        effect.serialize(buffer, offset)

        offset += effect.serializedLength()
      })

      return this
    },

    /**
     * The size of the entity serialized.
     *
     * @return {number}
     */
    serializedLength() {
      const effectsLength = this.effects.reduce(
        (acc, effect) => acc + effect.serializedLength(),
        0
      )

      return 1 + 24 + 8 * 5 + 1 + effectsLength
    }
  }
})

module.exports = Entity