import Effect from '../effect'
import { SPEEDUP } from '../../../common/effects'

Effect.register({
  type: SPEEDUP,
  parse(buffer, offset = 0) {
    /** 0-7: this.value */
    this.value = buffer.readDoubleBE(offset)
    offset += 8

    return offset
  }
})