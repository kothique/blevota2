/**
 * @module client/game/world
 */

import forIn from 'lodash/forIn'

import EntityFactory from './entity-factory'
import { V, Vector } from '@common/vector'

/**
 * @class
 */
const World = {
  /**
   * Initialize the world.
   *
   * @param {object} options
   * @param {Node}   options.svg - The <svg> element.
   * @chainable
   */
  init(options) {
    this.clear()

    this.svg = options.svg
  },

  /**
   * Return the world to its default state.
   *
   * @chainable
   */
  clear() {
    this.svg = null
    this.size = V(0, 0)
    this.viewport = V(0, 0)
    EntityFactory.clear()

    return this
  },

  /**
   * Spawn a new entity.
   *
   * @param {number}  id
   * @param {number}  type
   * @param {?object} options
   * @chainable
   */
  new(id, type, options = undefined) {
    const entity = EntityFactory.new(id, type, options)
    if (entity.node) {
      this.svg.appendChild(entity.node)
    }

    return this
  },

  /**
   * Remove the specified entity.
   *
   * @param {number} id
   * @chainable
   */
  remove(id) {
    const entity = EntityFactory.get(id)

    if (entity) {
      if (entity.node) {
        this.svg.removeChild(entity.node)
      }
      EntityFactory.remove(id)
    }

    return this
  },

  /**
   * Parse the world data received from the server.
   *
   * @param {Buffer} buffer
   * @param {number} offset
   * @chainable
   */
  parse(buffer, offset = 0) {
    /* Reserve all entities. */
    forIn(EntityFactory.entities, (entity) => entity.reserve())

    /* Read world size. */
    this.size = V(
      buffer.readUInt16BE(offset),
      buffer.readUInt16BE(offset + 2)
    )
    offset += 4

    /* Read viewport position. */
    this.viewport = V(
      buffer.readInt16BE(offset),
      buffer.readInt16BE(offset + 2)
    )
    offset += 4

    /* Read number of entities. */
    const entitiesCount = buffer.readUInt16BE(offset)
    offset += 2

    /* Read entities. */
    for (let i = 0; i < entitiesCount; i++) {
      const result = EntityFactory.deserialize(buffer, offset)

      /* Only show received entities. */
      result.entity.return()

      offset = result.offset
    }

    return this
  },

  /**
   * Render the world.
   *
   * @chainable
   */
  render() {
    forIn(EntityFactory.entities, (entity) => {
      if (!entity.reserved) {
        entity.render(this.viewport)
      }
    })

    return this
  },

  /**
   * Extrapolate the world state by the given timestamps.
   *
   * @param {object} timestamp - { prev, curr, next }
   * @chainable
   */
  extrapolate(timestamp) {
    forIn(EntityFactory.entities, (entity) => {
      entity.extrapolate(timestamp)
    })

    return this
  }
}

World.clear()

export default World