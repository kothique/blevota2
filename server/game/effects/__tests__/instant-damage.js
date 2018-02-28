const InstantDamage = require('../instant-damage')
const { INSTANT_DAMAGE } = require('../../../../common/effects')

describe('InstantDamage', () => {
  describe('onReceive()', () => {
    const effect = new InstantDamage(42),
          target  = { hp: 43 }

    effect.onReceive(target)

    test('should inflict damage', () => {
      expect(target.hp).toBe(1)
    })

    test('should die immediately', () => {
      expect(effect.alive).toBeFalsy()
    })
  })

  test('serialization', () => {
    const effect = new InstantDamage(42),
          buffer = Buffer.alloc(effect.serializedLength() + 10)

    effect.serialize(buffer, 10)

    expect(buffer.readUInt8(10 + 0)).toBe(INSTANT_DAMAGE)
    expect(buffer.readDoubleBE(10 + 1)).toBe(42)
  })
})