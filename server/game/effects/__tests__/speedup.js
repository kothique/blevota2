const SpeedUp = require('../speedup')
const { SPEEDUP } = require('@common/effects')

describe('SpeedUp', () => {
  describe('onReceive() & onRemove()', () => {
    const effect = new SpeedUp(42),
          target = { dragForceFactor: 42 }

    test('should decrease drag force factor on applying', () => {
      effect.onReceive(target)
      expect(target.dragForceFactor).toBeCloseTo(0)
    })

    test('should increase drag force factor back on removing', () => {
      effect.onRemove(target)
      expect(target.dragForceFactor).toBeCloseTo(42)
    })
  })

  test('serialization', () => {
    const effect = new SpeedUp(0.5),
          buffer = Buffer.alloc(effect.serializedLength() + 10)

    effect.serialize(buffer, 10)

    expect(buffer.readUInt8(10 + 0)).toBe(SPEEDUP)
    expect(buffer.readDoubleBE(10 + 1)).toBeCloseTo(0.5)
  })
})