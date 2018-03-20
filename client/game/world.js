/**
 * @module client/game/world
 */

import forIn from 'lodash/forIn'

import OrbFactory      from './orb-factory'
import registerObjects from './register-world-objects'

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

    this.orbFactory = new OrbFactory
    registerObjects(this.orbFactory)
  }

  /**
   * Spawn a new orb.
   *
   * @param {number}  id
   * @param {number}  type
   * @param {?object} options
   */
  new(id, type, options = {}) {
    const orb = this.orbFactory.new(id, type, options)
    if (orb.node) {
      this.svg.appendChild(orb.node)
    }
  }

  /**
   * Remove the specified orb.
   *
   * @param {number} id
   */
  remove(id) {
    const orb = this.orbFactory.get(id)

    if (orb) {
      if (orb.node) {
        this.svg.removeChild(orb.node)
      }
      this.orbFactory.remove(id)
    }
  }

  /** Remove all orbs. */
  clear() {
    forIn(this.orbFactory.orbs, (orb) => {
      if (orb.node) {
        this.svg.removeChild(orb.node)
      }
    })
    this.orbFactory.empty()
  }

  /**
   * Parse the world data received from the server.
   *
   * @param {Buffer} buffer
   * @param {number} offset
   */
  parse(buffer, offset = 0) {
    /* Reserve all orbs. */
    forIn(this.orbFactory.orbs, (orb) => orb.reserve())

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

    /* Read number of orbs. */
    const orbsCount = buffer.readUInt16BE(offset)
    offset += 2

    /* Read orbs. */
    for (let i = 0; i < orbsCount; i++) {
      const result = this.orbFactory.deserialize(buffer, offset)

      /* Only show received orbs. */
      result.orb.return()

      offset = result.offset
    }
  }

  /**
   * Update SVG attributes.
   */
  render() {
    forIn(this.orbFactory.orbs, (orb) => {
      if (!orb.reserved) {
        orb.render(this.viewport)
      }
    })
  }

  /**
   * Extrapolate the world state by the given timestamps.
   *
   * @param {object} timestamp - { prev, curr, next }
   */
  extrapolate(timestamp) {
    forIn(this.orbFactory.orbs, (orb) => {
      orb.extrapolate(timestamp)
    })
  }
}

export default World