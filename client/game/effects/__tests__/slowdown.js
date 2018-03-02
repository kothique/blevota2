import SlowDown from '../../effects/slowdown'
import { SLOWDOWN } from '../../../../common/effects'

describe('SlowDown', () => {
  let effect

  beforeEach(() => {
    effect = new SlowDown
  })

  test('should parse info correctly', () => {
    const buffer = Buffer.alloc(10 + 8)
    buffer.writeDoubleBE(42, 10)

    const offset = effect.parse(buffer, 10)

    expect(offset).toBe(10 + 8)
    expect(effect.value).toBe(42)
  })
})