import Entity from '../entity'

describe('Entity', () => {
  let entity

  beforeEach(() => {
    const id = 42,
          entityAPI = {
            createSkill: jest.fn(),
            createEffect: jest.fn()
          },
          type = 0x32

    entity = new Entity(id, entityAPI)
  })

  test('should have id, position, and effects', () => {
    expect(entity.id).toBeDefined()
    expect(entity.position).toBeDefined()
    expect(entity.effects).toBeDefined()
  })

  test('should parse info correctly (without effects)', () => {
    const buffer = Buffer.alloc(10 + 16 + 1)
    buffer.writeDoubleBE(41, 10 + 0)
    buffer.writeDoubleBE(42, 10 + 8)
    buffer.writeUInt8(0, 10 + 16)

    entity.parse(buffer, 10)

    expect(entity.position.x).toBe(41)
    expect(entity.position.y).toBe(42)
    expect(entity.effects.length).toBe(0)
  })

  test('should parse info correctly (with effects)', () => {
    const { default: EffectFactory } = require('../../effect-factory')

    const effectDesc1 = {
      type: 0x1,
      constructor: jest.fn(function () {
        this.parse = effectDesc1.parse
      }),
      parse: jest.fn(function (buffer, offset = 0) {
        this.value = buffer.readInt16LE(offset)
        offset += 2

        return offset
      })
    }
    const effectDesc2 = {
      type: 0x2,
      constructor: jest.fn(function () {
        this.parse = effectDesc2.parse
      }),
      parse: jest.fn(function (buffer, offset = 0) {
        return offset
      })
    }

    EffectFactory.register({
      type: effectDesc1.type,
      constructor: effectDesc1.constructor
    })
    EffectFactory.register({
      type: effectDesc2.type,
      constructor: effectDesc2.constructor
    })

    const buffer = Buffer.alloc(10 + 16 + 1 + 3 + 1)
    buffer.writeDoubleBE(41, 10 + 0)
    buffer.writeDoubleBE(42, 10 + 8)
    buffer.writeUInt8(2, 10 + 16)
    buffer.writeUInt8(effectDesc1.type, 10 + 17)
    buffer.writeInt16LE(43, 10 + 18)
    buffer.writeUInt8(effectDesc2.type, 10 + 20)

    entity.parse(buffer, 10)

    expect(entity.position.x).toBe(41)
    expect(entity.position.y).toBe(42)
    expect(entity.effects.length).toBe(2)
    expect(effectDesc1.constructor).toBeCalled()
    expect(effectDesc2.constructor).toBeCalled()
  })
})