/**
 * @module client/game/effect-factory
 */

import Unknown from './entities/unknown'

const constructors = Object.create(null)

/**
 * @class
 */
const EntityFactory = {
  /**
   * Register a new entity.
   *
   * @param {object}   options
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
   * @return {object} - { entity, offset }
   */
  deserialize(buffer, offset = 0) {
    const type = buffer.readUInt8(offset)
    offset += 1

    const id = buffer.toString('utf8', offset, offset + 24)
    offset += 24

    const constructor = constructors[type]
    if (!constructor) {
      console.warn(`Entity #${type} is not registered`)

      const entity = this.entities[id] = new Unknown(id, type)

      return { entity, offset }
    }

    let entity = this.entities[id]
    if (!entity) {
      entity = this.entities[id] = new constructor(id)
    }

    offset = entity.parse(buffer, offset)

    return { entity, offset }
  },

  /**
   * Get the entity with the specified id.
   *
   * @param {string} id
   */
  get(id) {
    return this.entities[id]
  },

  /**
   * Add a new entity if it doesn't exist.
   *
   * @param {string} id
   * @param {number} type
   */
  new(id, type) {
    const constructor = constructors[type]

    if (!constructor) {
      console.warn(`Entitty #${type} is not registered`)

      return this.entities[id] = new Unknown(id, type)
    }

    let entity = this.entities[id]
    if (!entity) {
      entity = this.entities[id] = new constructor(id)
    }

    return entity
  },

  /**
   * Remove an entity.
   *
   * @param {string} id
   */
  remove(id) {
    delete this.entities[id]
  },

  /**
   * Remove all entitites.
   */
  clear() {
    this.entities = Object.create(null)
  },

  entities: Object.create(null)
}

export default EntityFactory
