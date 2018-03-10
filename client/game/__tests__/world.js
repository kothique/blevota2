import { ORB } from '@common/entities'
let World
let EntityFactory

describe('World', () => {
  const id = 42,
        id1 = id,
        id2 = 54

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

  beforeEach(() => {
    jest.resetModules()

    World = require('../world').default
    EntityFactory = require('../entity-factory').default

    EntityFactory.register({
      type: entityDesc1.type,
      constructor: entityDesc1.constructor
    })
  })

  test('new() & remove()', done => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
          info = document.createElement('div')
    World.init({ svg, info })

    expect(Object.keys(EntityFactory.entities)).toHaveLength(0)

    World.new(id, ORB)
    expect(Object.keys(EntityFactory.entities)).toHaveLength(1)

    World.remove(id)
    expect(Object.keys(EntityFactory.entities)).toHaveLength(0)

    done()
  })

  test('clear()', done => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
          info = document.createElement('div')
    World.init({ svg, info })

    expect(Object.keys(EntityFactory.entities)).toHaveLength(0)

    World.new(id1, ORB)
    World.new(id2, ORB)
    expect(Object.keys(EntityFactory.entities)).toHaveLength(2)

    World.clear()
    expect(Object.keys(EntityFactory.entities)).toHaveLength(0)

    done()
  })

  /** @todo */
  test('parses correctly')

  /** @todo */
  test('extrapolates correctly')
})