import Magnetism from '../magnetism'
import { MAGNETISM } from '@common/effects'

describe('Magnetism', () => {
  let effect

  beforeEach(() => {
    effect = new Magnetism
  })

  test('should parse info correctly', () => {
    const buffer = Buffer.alloc(10 + 24)
    buffer.writeDoubleBE(42, 10)
    buffer.writeDoubleBE(64, 18)
    buffer.writeDoubleBE(33, 26)

    const offset = effect.parse(buffer, 10)

    expect(offset).toBe(10 + 24)
    expect(effect.minValue).toBe(42)
    expect(effect.maxValue).toBe(64)
    expect(effect.radius).toBe(33)
  })
})