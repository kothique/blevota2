/**
 * @module client/game/world
 */

import forIn from 'lodash/forIn'

import EntityFactory from './entity-factory'
import { V, Vector } from '../../common/vector'

/**
 * @class
 */
const World = {
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
    EntityFactory.clear()

    return this
  },

  /**
   * Spawn a new entity.
   *
   * @param {string} id
   * @param {number} type
   * @chainable
   */
  new(id, type) {
    const entity = EntityFactory.new(id, type)
    if (entity.node) {
      this.svg.appendChild(entity.node)
    }

    return this
  },

  /**
   * Remove the specified entity.
   *
   * @param {string} id
   * @chainable
   */
  remove(id) {
    const entity = EntityFactory.get(id)

    if (entity.node) {
      this.svg.removeChild(entity.node)
    }
    EntityFactory.remove(id)

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
      /** 0-1: this.size.x */
      buffer.readUInt16BE(offset),
      /** 2-3 this.size.y */
      buffer.readUInt16BE(offset + 2)
    )
    offset += 4

    /** 4-5: number of entities */
    const entitiesCount = buffer.readUInt16BE(offset)
    offset += 2

    /** 6-?: entities */
    for (let i = 0; i < entitiesCount; i++) {
      const result = EntityFactory.deserialize(buffer, offset)

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
      entity.render()
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