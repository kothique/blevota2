import Effect from '../effect'
import { SPEEDUP } from '../../../common/effects'

class SpeedUp extends Effect{
  /**
   * Read effect info from a buffer.
   *
   * @param {Buffer} buffer
   * @param {number} offset
   * @return {number} - New offset.
   */
  parse(buffer, offset = 0) {
    offset = super.parse(buffer, offset)

    /** 0-7: this.value */
    this.value = buffer.readDoubleBE(offset)
    offset += 8

    return offset
  }
}

export default SpeedUp