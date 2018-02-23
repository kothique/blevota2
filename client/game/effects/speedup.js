import Effect from '../effect'
import { SPEEDUP } from '../../../common/effects'

Effect.register({
  type: SPEEDUP,
  parse(buffer, offset) {
    this.value = buffer.readDoubleBE(offset)
    offset += 8

    return offset
  }
})