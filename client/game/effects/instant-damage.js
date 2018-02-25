import Effect from '../effect'
import { INSTANT_DAMAGE } from '../../../common/effects'

Effect.register({
  type: INSTANT_DAMAGE,
  parse(buffer, offset = 0) {
    /** 0-7: this.value */
    this.value = buffer.readDoubleBE(offset)
    offset += 8

    return offset
  }
})