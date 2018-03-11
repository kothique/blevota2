const Magnetism = require('../magnetism')
const { MAGNETISM } = require('@common/effects')

const { Vector, V } = require('@common/vector')

describe('Magnetism', () => {
  const effectAPI = {
    queryBox: jest.fn(() => []),
    getEntity: jest.fn()
  }

  beforeEach(() => {
    effectAPI.queryBox.mockClear()
    effectAPI.getEntity.mockClear()
  })

  describe('onTick()', () => {
    const effect = new Magnetism({
      minValue: 42,
      maxValue: 64,
      radius: 60
    }, effectAPI)

    const target = {
      position: V(0, 0),
      radius:   40
    }

    test('should call effectAPI.queryBox', () => {
      effect.onTick(target, 2.0, 0.01)

      expect(effectAPI.queryBox).toBeCalled()
    })
  })

  test('serialization', () => {
    const effect = new Magnetism({
      minValue: 42,
      maxValue: 64,
      radius: 60
    }, effectAPI)

    const buffer = Buffer.alloc(effect.binaryLength + 10)

    effect.serialize(buffer, 10)

    expect(buffer.readUInt8(10 + 0)).toBe(MAGNETISM)
    expect(buffer.readDoubleBE(10 + 1)).toBeCloseTo(42)
    expect(buffer.readDoubleBE(10 + 9)).toBeCloseTo(64)
    expect(buffer.readDoubleBE(10 + 17)).toBeCloseTo(60)
  })
})