let EffectFactory

describe('EffectFactory', () => {
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

  beforeEach(() => {
    jest.resetModules()

    EffectFactory = require('../effect-factory').default

    effectDesc1.constructor.mockClear()
    effectDesc1.parse.mockClear()

    effectDesc2.constructor.mockClear()
    effectDesc2.parse.mockClear()

    EffectFactory.register({
      type: effectDesc1.type,
      constructor: effectDesc1.constructor
    })
    EffectFactory.register({
      type: effectDesc2.type,
      constructor: effectDesc2.constructor
    })
  })

  test('should correctly deserialize an effect after registration', done => {
    const buffer = Buffer.alloc(10 + 1 + 2)
    buffer.writeUInt8(effectDesc1.type, 10 + 0)
    buffer.writeInt16LE(-652, 10 + 1)

    const { effect, offset } = EffectFactory.deserialize(buffer, 10)

    expect(offset).toBe(10 + 1 + 2)
    expect(effectDesc1.constructor).toBeCalled()
    expect(effect.parse).toBeCalled()
    expect(effect.parse).toBeCalledWith(buffer, 10 + 1)
    expect(effect.value).toBeCloseTo(-652)

    done()
  })
})