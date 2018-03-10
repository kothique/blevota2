/**
 * @module client/game/effects/magnetism
 */

import Effect from '@client/game/effects/effect'

/**
 * @class
 */
class Magnetism extends Effect {
  /**
   * Read effect from a buffer.
   *
   * @param {Buffer}  buffer
   * @param {?number} offset
   * @return {number}        - New offset.
   */
  parse(buffer, offset = 0) {
    offset = super.parse(buffer, offset)

    this.minValue = buffer.readDoubleBE(offset)
    offset += 8

    this.maxValue = buffer.readDoubleBE(offset)
    offset += 8

    this.radius = buffer.readDoubleBE(offset)
    offset += 8

    return offset
  }
}

export default Magnetism