/**
 * @module client/game/entity
 */

let entities = Object.create(null)
const factories = Object.create(null)

const Entity = {
  /**
   * Register a new entity.
   *
   * @param {object} options
   * @param {number} options.type - Entity type identificator.
   * @param {function} options.parse - Function that reads the entity data from a buffer
   *  with the specified offset and returns the new offset.
   * @param {function} options.extrapolate - Linear extrapolation.
   * @param {function} options.render - Set attributes to the underlying DOM node.
   */
  register(options) {
    const { type, init, parse, extrapolate, render } = options,
          factory = (id) => {
            /** Prototype. */
            const entity = Object.create({
              type,
              parse,
              extrapolate,
              render
            })

            /** Instance properties. */
            Object.assign(entity, {
              id
            })

            /** Initialization. */
            init.call(entity)

            return entity
          }

    factories[type] = factory
  },

  /**
   * Create a new entity from a buffer.
   *
   * @param {Buffer} buffer
   * @param {?number} offset
   * @return {object} - { entity, offset }
   */
  deserialize(buffer, offset = 0) {
    const type = buffer.readUInt8(offset)
    offset += 1

    const id = buffer.toString('utf8', offset, offset + 24)
    offset += 24

    const factory = factories[type]
    if (!factory) {
      console.warn(`Entity #${type} is not registered`)

      return {
        entity: { id, type },
        offset
      }
    }

    if (!entities[id]) {
      entities[id] = factory(id)
    }
    const entity = entities[id]
    offset = entity.parse(buffer, offset)

    return { entity, offset }
  },

  /**
   * Create a new entity with the specified id and type.
   *
   * @param {string} id
   * @return {object}
   */
  new(id, type) {
    const factory = factories[type]

    if (!factory) {
      console.warn(`Entity #${type} is not registered`)

      return {
        id,
        type
      }
    }

    if (Entity.get(id)) {
      Entity.remove(id)
    }

    const entity = entities[id] = factory(id)

    return entity
  },

  /**
   * Get the entity with the specified id.
   *
   * @param {string} id
   */
  get(id) {
    return entities[id]
  },

  /**
   * Remove the entity with the specified id.
   *
   * @param {string} id
   */
  remove(id) {
    delete entities[id]
  },

  /**
   * Remove all entities.
   */
  clear() {
    entities = Object.create(null)
  }
}

export default Entity