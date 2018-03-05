import InstantDamage from '../instant-damage'
import { INSTANT_DAMAGE } from '@common/effects'

describe('InstantDamage', () => {
  let effect

  beforeEach(() => {
    effect = new InstantDamage({ value: 42 })
  })

  test('should parse info correctly', () => {
    const buffer = Buffer.alloc(10 + 8)
    buffer.writeDoubleBE(42, 10)

    const offset = effect.parse(buffer, 10)

    expect(offset).toBe(10 + 8)
    expect(effect.value).toBe(42)
  })
})