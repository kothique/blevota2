/**
 * @module client/game/world
 */

import Entity from './entity'
import { V, Vector } from '../../common/vector'

const World = {
  /**
   * Spawn a new entity.
   *
   * @param {string} id
   * @param {number} type
   * @chainable
   */
  new(id, type) {
    const entity = Entity.new(id, type)
    Entity.entities[id] = entity
    this.svg.appendChild(entity.node)

    return this
  },

  /**
   * Remove the specified entity.
   *
   * @param {string} id
   * @chainable
   */
  remove(id) {
    this.svg.removeChild(Entity.entities[id].node)
    delete Entity.entities[id]
    Entity.remove(id)

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
    this.size = V(
      /** 0-7: this.size.x */
      buffer.readDoubleBE(offset),
      /** 8-15: this.size.y */
      buffer.readDoubleBE(offset + 8)
    )
    offset += 16

    /** 16-17: number of entities */
    const entitiesCount = buffer.readUInt16(offset)
    offset += 2

    /** 18-?: entities */
    for (let i = 0; i < entitiesCount; i++) {
      const result = Entity.deserialize(buffer.offset)

      offset = result.offset
    }

    return this
  },

  /**
   * Extrapolate the world state by the given timestamps.
   *
   * @param {object} timestamp - { prev, curr, next }
   * @chainable
   */
  extrapolate(timestamp) {
    for (const id in Entity.entites) {
      Entity.entities[id].extrapolate(timestamp)
    }

    return this
  },

  /**
   * Initialize the world.
   *
   * @param {object} options
   * @param {Node} options.svg - The <svg> element.
   * @param {Node} options.info
   * @chainable
   */
  init(options) {
    const { svg, info } = options

    this.clear()
    this.svg = svg
    this.info = info
  },

  /**
   * Return the world to its default state.
   *
   * @chainable
   */
  clear() {
    this.svg = null
    this.size = V(0, 0)
    Entity.entities = Object.create(null)
    Entity.clear()

    return this
  },
}

World.clear()

export default World