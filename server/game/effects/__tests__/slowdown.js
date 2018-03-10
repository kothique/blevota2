const SlowDown = require('../slowdown')
const { SLOWDOWN } = require('@common/effects')

describe('SlowDown', () => {
  describe('onReceive() & onRemove()', () => {
    const effect = new SlowDown({ value: 0.2 }, null),
          target = { dragForceFactor: 1 }

    test('should increse drag force factor on applying', () => {
      effect.onReceive(target)
      expect(target.dragForceFactor).toBeCloseTo(1.2)
    })

    test('should decrease drag force factor back on removing', () => {
      effect.onRemove(target)
      expect(target.dragForceFactor).toBeCloseTo(1)
    })
  })

  test('serialization', () => {
    const effect = new SlowDown({ value: 0.5 }, null),
          buffer = Buffer.alloc(effect.serializedLength() + 10)

    effect.serialize(buffer, 10)

    expect(buffer.readUInt8(10 + 0)).toBe(SLOWDOWN)
    expect(buffer.readDoubleBE(10 + 1)).toBeCloseTo(0.5)
  })
})