const SlowDown = require('../slowdown')
const { SLOWDOWN } = require('@common/effects')

describe('SlowDown', () => {
  describe('onReceive() & onRemove()', () => {
    const effect = new SlowDown(42),
          target = { moveForce: 59 }

    test('should decrese movement force on applying', () => {
      effect.onReceive(target)
      expect(target.moveForce).toBe(17)
    })

    test('should increase movement force back on removing', () => {
      effect.onRemove(target)
      expect(target.moveForce).toBe(59)
    })
  })

  test('serialization', () => {
    const effect = new SlowDown(0.5),
          buffer = Buffer.alloc(effect.serializedLength() + 10)

    effect.serialize(buffer, 10)

    expect(buffer.readUInt8(10 + 0)).toBe(SLOWDOWN)
    expect(buffer.readDoubleBE(10 + 1)).toBeCloseTo(0.5)
  })
})