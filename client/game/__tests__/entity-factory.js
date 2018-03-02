let EntityFactory

describe('Entity', () => {
  const id = 123

  const entityDesc1 = {
    type: 0x1,
    constructor: jest.fn(function (id) {
      this.id = id
      this.parse = entityDesc1.parse
    }),
    parse: jest.fn(function (buffer, offset = 0) {
      this.value = buffer.readInt16LE(offset)
      offset += 2

      return offset
    })
  }

  const entityDesc2 = {
    type: 0x2,
    constructor: jest.fn(function () {
      this.parse = entityDesc2.parse
    }),
    parse: jest.fn(function (buffer, offset = 0) {
      return offset
    })
  }

  beforeEach(() => {
    jest.resetModules()

    EntityFactory = require('../entity-factory').default

    entityDesc1.constructor.mockClear()
    entityDesc1.parse.mockClear()

    entityDesc2.constructor.mockClear()
    entityDesc2.parse.mockClear()

    EntityFactory.register({
      type: entityDesc1.type,
      constructor: entityDesc1.constructor
    })
    EntityFactory.register({
      type: entityDesc2.type,
      constructor: entityDesc2.constructor
    })
  })

  test('should correctly deserialize an entity after registration', done => {
    const buffer = Buffer.alloc(10 + 2 + 1 + 2)
    buffer.writeUInt16BE(id, 10 + 0)
    buffer.writeUInt8(entityDesc1.type, 10 + 2)
    buffer.writeInt16LE(-850, 10 + 2 + 1)

    const { entity, offset } = EntityFactory.deserialize(buffer, 10)

    expect(offset).toBe(10 + 2 + 1 + 2)
    expect(entityDesc1.constructor).toBeCalled()
    expect(entity.parse).toBeCalled()
    expect(entity.parse).toBeCalledWith(buffer, 10 + 2 + 1)
    expect(entity.id).toBe(id)
    expect(entity.value).toBe(-850)

    done()
  })

  test('EntityFactory.new & EntityFactory.remove', () => {
    expect(EntityFactory.get(id)).toBeUndefined()

    EntityFactory.new(id, entityDesc1.type)
    expect(EntityFactory.get(id)).toBeDefined()

    EntityFactory.remove(id)
    expect(EntityFactory.get(id)).toBeUndefined()
  })
})