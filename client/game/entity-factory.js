/**
 * @module client/game/effect-factory
 */

import Unknown from './entities/unknown'

/**
 * @class
 */
class EntityFactory {
  constructor() {
    this.constructors = Object.create(null)
    this.entities = Object.create(null)
  }

  /**
   * Register a new entity.
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
   * Create a new entity from a buffer.
   *
   * @param  {Buffer}  buffer
   * @param  {?number} offset
   * @return {object} - { entity, offset }
   */
  deserialize(buffer, offset = 0) {
    const id = buffer.readUInt16BE(offset)
    offset += 2

    const type = buffer.readUInt8(offset)
    offset += 1

    const constructor = this.constructors[type]
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
  }

  /**
   * Get the entity with the specified id.
   *
   * @param {number} id
   */
  get(id) {
    return this.entities[id]
  }

  /**
   * Add a new entity if it doesn't exist.
   *
   * @param {number}  id
   * @param {number}  type
   * @param {?object} options
   */
  new(id, type, options = undefined) {
    const constructor = this.constructors[type]

    if (!constructor) {
      console.warn(`Entitty #${type} is not registered`)

      return this.entities[id] = new Unknown(id, type)
    }

    let entity = this.entities[id]
    if (!entity) {
      entity = this.entities[id] = new constructor(id, options)
    }

    return entity
  }

  /**
   * Remove an entity.
   *
   * @param {number} id
   */
  remove(id) {
    delete this.entities[id]
  }

  empty() {
    this.entities = {}
  }
}

export default EntityFactory
