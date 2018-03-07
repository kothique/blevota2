/**
 * @module client/game/entity
 */

import Set from 'collections/set'

import EffectFactory from '../effect-factory'
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

    this.previous = {}

    this.position = V(0, 0)
    this.previous.position = V(0, 0)

    this.effects = new Set

    this.invisible = false
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

    this.position = V(
      buffer.readDoubleBE(offset),
      buffer.readDoubleBE(offset + 8)
    )
    offset += 16

    this.effects.clear()

    const effectsCount = buffer.readUInt8(offset)
    offset += 1

    for (let i = 0; i < effectsCount; i++) {
      const result = EffectFactory.deserialize(buffer, offset)

      offset = result.offset
      this.effects.add(result.effect)
    }

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

  /**
   * Make the entity invisible.
   */
  hide() {
    this.invisible = true
  }

  /**
   * Show the entity on the screen.
   */
  show() {
    this.invisible = false
  }
}

export default Entity