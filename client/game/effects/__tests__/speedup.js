import Effect from '../../effect'
import '../speedup'
import { SPEEDUP } from '../../../../common/effects'

describe('SpeedUp', () => {
  test('deserializes correctly', () => {
    const buffer = Buffer.alloc(10 + 1 + 8)
    buffer.writeUInt8(SPEEDUP, 10 + 0)
    buffer.writeDoubleBE(42, 10 + 1)

    const { effect } = Effect.deserialize(buffer, 10)

    expect(effect.type).toBe(SPEEDUP)
    expect(effect.value).toBe(42)
  })
})