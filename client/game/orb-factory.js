/**
 * @module client/game/orb-factory
 */

/**
 * @class
 */
class OrbFactory {
  constructor() {
    this.constructors = {}
    this.orbs         = {}
  }

  /**
   * Register a new orb.
   *
   * @param {object}   options
   * @param {number}   options.type
   * @param {function} options.constructor
   */
  register(options) {
    const { type, constructor } = options

    this.constructors[type] = constructor    
  }

  /**
   * Create a new orb from a buffer.
   *
   * @param  {Buffer}  buffer
   * @param  {?number} offset
   * @return {object} - { orb, offset }
   */
  deserialize(buffer, offset = 0) {
    const id = buffer.readUInt16BE(offset)
    offset += 2

    const type = buffer.readUInt8(offset)
    offset += 1

    const orb = this.new(id, type)
    if (orb) offset = orb.parse(buffer, offset)

    return { orb, offset }
  }

  /**
   * Get the orb with the specified id.
   *
   * @param {number} id
   */
  get(id) {
    return this.orbs[id]
  }

  /**
   * Add a new orb if it doesn't exist.
   *
   * @param {number}  id
   * @param {number}  type
   * @param {?object} options
   */
  new(id, type, options = {}) {
    const constructor = this.constructors[type]

    if (!constructor) {
      console.warn(`Orb #${type} is not registered`)

      return null
    }

    options.orbAPI = {
      createSkill: (constr, options = {}) => {
        options.skillAPI = {
          getOrbs: () => this.orbs
        }

        return new constr(options)
      }
    }

    let orb = this.orbs[id]
    if (!orb) {
      orb = this.orbs[id] = new constructor(id, options)
      orb.id = id
    }

    return orb
  }

  /**
   * Remove an orb.
   *
   * @param {number} id
   */
  remove(id) {
    delete this.orbs[id]
  }

  empty() {
    this.orbs = {}
  }
}

export default OrbFactory
