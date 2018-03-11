/**
 * @module client/game/effects/hidden-strike
 */

import Effect from '@client/game/effects/effect'

/**
 * @class
 */
class HiddenStrike extends Effect {
  /**
   * Read the effect from the buffer.
   *
   * @param {Buffer}  buffer
   * @param {?number} offset
   * @return {number} - New offset.
   */
  parse(buffer, offset = 0) {
    offset = super.parse(buffer, offset)

    this.progress = buffer.readUInt8(offset) / 100
    offset += 1

    return offset
  }
}

export default HiddenStrike