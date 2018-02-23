/**
 * @module client/game/effect
 */

import * as effects from '../../common/effects'

const factories = Object.create(null)

const Effect = {
  /**
   * Register a new effect.
   *
   * @param {object}   options
   * @param {number}   options.type  - Effect type identificator.
   * @param {function} options.parse - Function that reads the effect data from a buffer
   *  with the specified offset and returns the new offset.
   */
  register(options) {
    const { type, parse } = options,
          factory = () => Object.create({
            type,
            parse
          })

    factories[type] = factory
  },

  /**
   * Create a new effect from a buffer.
   *
   * @param {Buffer} buffer
   * @param {?number} offset
   * @return {object} - { effect, offset }
   */
  deserialize(buffer, offset = 0) {
    const type = buffer.readUInt8(offset)
    offset += 1

    const factory = factories[type]
    if (!factory) {
      console.warn(`Effect #${type} is not registered`)

      return {
        effect: { type },
        offset
      }
    }

    const effect = factory()
    offset = effect.parse(buffer, offset)

    return { effect, offset }
  }
}

export default Effect