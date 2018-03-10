const World = require('../world')
const Entity = require('@server/game/entities/entity')
const { UNKNOWN } = require('@common/entities')
const { Vector, V } = require('@common/vector')

describe('World', () => {
  let world

  beforeEach(() => {
    world = new World({
      size: V(800, 600)
    })
  })

  describe('new() & remove()', () => {
    let entity

    beforeEach(() => {
      entity = new Entity({
        mass: 0.1,
        moveForce: 15
      })
    })

    test('new() should add new entities', () => {
      expect(Object.keys(world.entities)).toHaveLength(0)

      const id = world.new(entity)
      expect(Object.keys(world.entities)).toHaveLength(1)
    })

    test('remove() should remove entities', () => {
      const id = world.new(entity)
      expect(Object.keys(world.entities)).toHaveLength(1)

      world.remove(id)
      expect(Object.keys(world.entities)).toHaveLength(0)
    })
  })

  describe('iteration', () => {
    const mockObject = (object) => {
      object.applyControls = jest.fn(object.applyControls)
      object.integrate = jest.fn(object.integrate)
      object.applyEffects = jest.fn(object.applyEffects)
    }

    let entity1, entity2,
        id1, id2

    beforeEach(() => {
      entity1 = new Entity({
        mass: 1,
        moveForce: 0.1,
      })
      mockObject(entity1)
      id1 = world.new(entity1)


      entity2 = new Entity({
        mass: 2,
        moveForce: 0.25
      })
      mockObject(entity2)
      id2 = world.new(entity2)
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
    const entity1 = new Entity({
      mass: 1,
      moveForce: 0.1,
    })

    const entity2 = new Entity({
      mass: 2,
      moveForce: 0.25
    })

    const id1 = world.new(entity1),
          id2 = world.new(entity2)

    const length = world.serializedLength(),
          buffer = Buffer.alloc(length)
    world.serialize(buffer)

    let offset = 0

    expect(buffer.readUInt16BE(offset)).toBe(800)
    offset += 2

    expect(buffer.readUInt16BE(offset)).toBe(600)
    offset += 2

    expect(buffer.readUInt16BE(offset)).toBe(0)
    offset += 2

    expect(buffer.readUInt16BE(offset)).toBe(0)
    offset += 2

    const entitiesCount = buffer.readUInt16BE(offset)
    offset += 2
    expect(entitiesCount).toBe(2)

    expect(buffer.readInt16BE(offset)).toBe(id1)
    offset += 2

    expect(buffer.readUInt8(offset)).toBe(UNKNOWN)
    offset += 1

    offset += entity1.serializedLength()

    expect(buffer.readInt16BE(offset)).toBe(id2)
    offset += 2

    expect(buffer.readUInt8(offset)).toBe(UNKNOWN)
    offset += 1

    offset += entity2.serializedLength()

    expect(offset).toBe(length)
  })

  test('toBuffer() should give the same result as serialize(*new buffer*, 0)', () => {
    const buffer = Buffer.alloc(world.serializedLength())
    world.serialize(buffer)

    expect(world.toBuffer().equals(buffer)).toBeTruthy()
  })

  /** @todo */
  test('should serialize a box correctly')

  /** @todo */
  test('boxToBuffer() should give the same result as serializeToBuffer(*new buffer*, 0)')
})
