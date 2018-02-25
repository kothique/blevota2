const World = require('../world')
const Entity = require('../entity')
const { ENTITY } = require('../../../common/entities')
const { Vector, V } = require('../../../common/vector')

describe('World', () => {
  let world

  beforeEach(() => {
    world = World.create(V(800, 600))
  })

  describe('new() & remove()', () => {
    let entity

    beforeEach(() => {
      entity = Entity.create('a'.repeat(24), {
        mass: 0.1,
        moveForce: 15
      })
    })

    test('new() should add new entities', () => {
      expect(Object.keys(world.entities)).toHaveLength(0)

      world.new(entity)
      expect(Object.keys(world.entities)).toHaveLength(1)
    })

    test('remove() should remove entities', () => {
      world.new(entity)
      expect(Object.keys(world.entities)).toHaveLength(1)

      world.remove(entity.id)
      expect(Object.keys(world.entities)).toHaveLength(0)
    })
  })

  describe('iteration', () => {
    const mockObject = (object) => {
      Object.getOwnPropertyNames(object.__proto__).forEach((prop) => {
        if (typeof object.__proto__[prop] === 'function') {
          object[prop] = jest.fn(object.__proto__[prop])
        }
      })
    }

    const id1 = 'a'.repeat(24),
          id2 = 'b'.repeat(24)

    let entity1, entity2

    beforeEach(() => {
      entity1 = Entity.create(id1, {
        mass: 1,
        moveForce: 0.1,
      })
      mockObject(entity1)
      world.new(entity1)


      entity2 = Entity.create(id2, {
        mass: 2,
        moveForce: 0.25
      })
      mockObject(entity2)
      world.new(entity2)
    })

    test('clearForces() should clear forces', () => {
      world.clearForces()

      expect(entity1.force).toEqual(V(0, 0))
      expect(entity2.force).toEqual(V(0, 0))
    })

    test('applyControls() should call Entity.applyControls()', () => {
      const controls = {
        [id1]: { prop: 'one value' },
        [id2]: { prop: 'different value' }
      }
      world.applyControls(controls)

      expect(entity1.applyControls).toBeCalled()
      expect(entity1.applyControls).toBeCalledWith(controls[id1])
      expect(entity2.applyControls).toBeCalled()
      expect(entity2.applyControls).toBeCalledWith(controls[id2])
    })

    test('integrate() should call Entity.integrate()', () => {
      world.integrate(0, 0.01)

      expect(entity1.integrate).toBeCalled()
      expect(entity1.integrate).toBeCalledWith(0, 0.01)
      expect(entity2.integrate).toBeCalled()
      expect(entity2.integrate).toBeCalledWith(0, 0.01)
    })

    test('applyEffects() should call Entity.applyEffects()', () => {
      world.applyEffects(0, 0.02)

      expect(entity1.applyEffects).toBeCalled()
      expect(entity1.applyEffects).toBeCalledWith(0, 0.02)
      expect(entity2.applyEffects).toBeCalled()
      expect(entity2.applyEffects).toBeCalledWith(0, 0.02)
    })
  })

  test('should serialize correctly', () => {
    const id1 = 'a'.repeat(24),
          id2 = 'b'.repeat(24)

    const entity1 = Entity.create(id1, {
      mass: 1,
      moveForce: 0.1,
    })

    const entity2 = Entity.create(id2, {
      mass: 2,
      moveForce: 0.25
    })

    world.new(entity1)
    world.new(entity2)

    const length = world.serializedLength(),
          buffer = Buffer.alloc(length)
    world.serialize(buffer)

    let offset = 0

    expect(buffer.readUInt16BE(offset)).toBe(800)
    offset += 2

    expect(buffer.readUInt16BE(offset)).toBe(600)
    offset += 2

    const entitiesCount = buffer.readUInt16BE(offset)
    offset += 2
    expect(entitiesCount).toBe(2)

    expect(buffer.readUInt8(offset)).toBe(ENTITY)
    offset += 1

    expect(buffer.toString('utf8', offset, offset + 24)).toBe('a'.repeat(24))
    offset += 24

    offset += entity1.serializedLength() - 1 - 24

    expect(buffer.readUInt8(offset)).toBe(ENTITY)
    offset += 1

    expect(buffer.toString('utf8', offset, offset + 24)).toBe('b'.repeat(24))
    offset += 24

    offset += entity2.serializedLength() - 1 - 24
    expect(offset).toBe(length)
  })

  test('toBuffer() should give the same result as serialize(*new buffer*, 0)', () => {
    const buffer = Buffer.alloc(world.serializedLength())
    world.serialize(buffer)

    expect(world.toBuffer().equals(buffer)).toBeTruthy()
  })
})
