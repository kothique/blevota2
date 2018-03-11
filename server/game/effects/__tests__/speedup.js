const SpeedUp = require('../speedup')
const { SPEEDUP } = require('@common/effects')

describe('SpeedUp', () => {
  describe('onReceive() & onRemove()', () => {
    const effect = new SpeedUp({ value: 42 }, null),
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
    const effect = new SpeedUp({ value: 0.5 }),
          buffer = Buffer.alloc(effect.binaryLength + 10)

    effect.serialize(buffer, 10)

    expect(buffer.readUInt8(10 + 0)).toBe(SPEEDUP)
    expect(buffer.readDoubleBE(10 + 1)).toBeCloseTo(0.5)
  })
})