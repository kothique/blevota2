/**
 * @module client/game/entity
 */

import Set from 'collections/set'

import { Vector, V } from '@common/vector'

/**
 * @class
 */
class Entity {
  /**
   * Create a new entity.
   *
   * @param {number}  id
   */
  constructor(id) {
    this.id = id

    this.position = V(0, 0)
    this.previous = {
      position: V(0, 0)
    }

    this.reserved = false
  }

  /**
   * Read entity info except for id from a buffer.
   *
   * @param {Buffer} buffer 
   * @param {number} offset 
   * @return {number} - New offset.
   */
  parse(buffer, offset = 0) {
    this.previous.position = this.position.clone()

    this.position = V(buffer.readDoubleBE(offset), buffer.readDoubleBE(offset + 8))
    offset += 16

    return offset
  }

  /**
   * Extrapolation.
   *
   * @param {object} timestamp
   * @param {number} timestamp.prev
   * @param {number} timestamp.curr
   * @param {number} timestamp.next
   */
  extrapolate(timestamp) {
    const { prev, curr, next } = timestamp

    this.position.add(
      Vector.subtract(this.position, this.previous.position)
        .divide(curr - prev)
        .multiply(next - curr)
    )
  }

  /**
   * Rendering.
   */
  render() {}

  reserve() { this.reserved = true }

  return() { this.reserved = false }
}

export default Entity