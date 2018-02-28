/**
 * @module client/game/effect-factory
 */

import Unknown from './effects/unknown'

const constructors = Object.create(null)

/**
 * @class
 */
const EffectFactory = {
  /**
   * Register a new effect.
   *
   * @param {object}
   * @param {number}   options.type
   * @param {function} options.constructor
   */
  register(options) {
    const { type, constructor } = options

    constructors[type] = constructor    
  },

  /**
   * Create a new entity from a buffer.
   *
   * @param  {Buffer}  buffer
   * @param  {?number} offset
   * @return {object} - { effect, offset }
   */
  deserialize(buffer, offset = 0) {
    const type = buffer.readUInt8(offset)
    offset += 1

    const constructor = constructors[type]
    if (!constructor) {
      console.warn(`Effect #${type} is not registered`)

      return { 
        effect: new Unknown(type),
        offset
      }
    }

    const effect = new constructor
    offset = effect.parse(buffer, offset)

    return { effect, offset }
  },
}

export default EffectFactory