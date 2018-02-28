const SpeedUp = require('../speedup')
const { SPEEDUP } = require('../../../../common/effects')

describe('SpeedUp', () => {
  describe('onReceive() & onRemove()', () => {
    const effect = new SpeedUp(42),
          target = { moveForce: 0 }

    test('should increase moveForce on applying', () => {
      effect.onReceive(target)
      expect(target.moveForce).toBe(42)
    })

    test('should decrease back moveForce on removing', () => {
      effect.onRemove(target)
      expect(target.moveForce).toBe(0)
    })
  })

  test('serialization', () => {
    const effect = new SpeedUp(0.5),
          buffer = Buffer.alloc(effect.serializedLength() + 10)

    effect.serialize(buffer, 10)

    expect(buffer.readUInt8(10 + 0)).toBe(SPEEDUP)
    expect(buffer.readDoubleBE(10 + 1)).toBe(0.5)
  })
})