/**
 * @module client/game/world
 */

import forIn from 'lodash/forIn'

import EntityFactory   from './entity-factory'
import registerObjects from './registerWorldObjects'

import { V, Vector } from '@common/vector'

/**
 * @class
 */
class World {
  /**
   * @param {object} options
   * @param {Node}   options.svg - The <svg> element.
   * @chainable
   */
  constructor(options) {
    this.svg  = options.svg

    this.size     = V(0, 0)
    this.viewport = V(0, 0)

    this.entityFactory = new EntityFactory
    registerObjects(this.entityFactory)
  }

  /**
   * Spawn a new entity.
   *
   * @param {number}  id
   * @param {number}  type
   * @param {?object} options
   */
  new(id, type, options = undefined) {
    const entity = this.entityFactory.new(id, type, options)
    if (entity.node) {
      this.svg.appendChild(entity.node)
    }
  }

  /**
   * Remove the specified entity.
   *
   * @param {number} id
   */
  remove(id) {
    const entity = this.entityFactory.get(id)

    if (entity) {
      if (entity.node) {
        this.svg.removeChild(entity.node)
      }
      this.entityFactory.remove(id)
    }
  }

  /** Remove all entities. */
  clear() {
    forIn(this.entityFactory.entities, (entity) => {
      if (entity.node) {
        this.svg.removeChild(entity.node)
      }
    })
  }

  /**
   * Parse the world data received from the server.
   *
   * @param {Buffer} buffer
   * @param {number} offset
   */
  parse(buffer, offset = 0) {
    /* Reserve all entities. */
    forIn(this.entityFactory.entities, (entity) => entity.reserve())

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
      const result = this.entityFactory.deserialize(buffer, offset)

      /* Only show received entities. */
      result.entity.return()

      offset = result.offset
    }
  }

  /**
   * Update SVG attributes.
   */
  render() {
    forIn(this.entityFactory.entities, (entity) => {
      if (!entity.reserved) {
        entity.render(this.viewport)
      }
    })
  }

  /**
   * Extrapolate the world state by the given timestamps.
   *
   * @param {object} timestamp - { prev, curr, next }
   */
  extrapolate(timestamp) {
    forIn(this.entityFactory.entities, (entity) => {
      entity.extrapolate(timestamp)
    })
  }
}

export default World