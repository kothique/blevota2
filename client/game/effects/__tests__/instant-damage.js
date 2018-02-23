import Effect from '../../effect'
import '../instant-damage'
import { INSTANT_DAMAGE } from '../../../../common/effects'

describe('InstantDamage', () => {
  test('deserializes correctly', () => {
    const buffer = Buffer.alloc(10 + 1 + 8)
    buffer.writeUInt8(INSTANT_DAMAGE, 10 + 0)
    buffer.writeDoubleBE(42, 10 + 1)

    const { effect } = Effect.deserialize(buffer, 10)

    expect(effect.type).toBe(INSTANT_DAMAGE)
    expect(effect.value).toBe(42)
  })
})