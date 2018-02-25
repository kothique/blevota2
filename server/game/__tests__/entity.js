const Entity = require('../entity')
const { ENTITY } = require('../../../common/entities')
const { V, Vector } = require('../../../common/vector')

describe('Entity', () => {
  test('applyControls() should set force', () => {
    const entity = Entity.create('a'.repeat(24), {
      mass:      0.5,
      moveForce: 0.1
    })

    entity.applyControls({
      pX: 100,
      pY: 100,
      move: true
    })

    expect(entity.force.isZero(1e-2)).toBeFalsy()
  })

  describe('receiveEffect() & removeEffect()', () => {
    const entity = Entity.create('a'.repeat(24), {
      mass: 0.5
    })

    const effect = {
      onReceive: jest.fn(),
      onRemove: jest.fn()
    }

    test('receiveEffect() should call onReceive()', () => {
      entity.receiveEffect(effect)

      expect(effect.onReceive).toBeCalled()
      expect(effect.onReceive).toBeCalledWith(entity)
      expect(effect.onRemove).not.toBeCalled()
    })

    test('removeEffect() should call onRemove()', () => {
      entity.removeEffect(effect)

      expect(effect.onRemove).toBeCalled()
      expect(effect.onRemove).toBeCalledWith(entity)
    })
  })

  describe('applyEffects()', () => {
    const entity = Entity.create('a'.repeat(24), {
      mass: 0.5
    })

    const effect = {
      onTick: jest.fn(function () {
        this.alive = false
      }),
      onReceive: jest.fn(),
      onRemove: jest.fn(),
      alive: true
    }
    entity.receiveEffect(effect)

    test('should call onTick()', () => {
      entity.applyEffects(0, 0.01)
      expect(effect.onTick).toBeCalled()
      expect(effect.onTick).toBeCalledWith(entity, 0, 0.01)
    })

    test('should remove effect right after its death', () => {
      expect(effect.alive).toBeFalsy()
      expect(entity.effects).toHaveLength(0)
    })
  })

  describe('integration', () => {
    let entity

    beforeEach(() => {
      entity = Entity.create('a'.repeat(), {
        mass: 1,
        moveForce: 0.1,
        position: V(10, 10)
      })
    })

    test('should not move by itself', () => {
      entity.integrate(0, 0.01)

      expect(entity.position).toEqual(V(10, 10))
      entity.position = V(12, 12)
    })

    test('should move if a force is specified', () => {
      entity.force = V(0.1, 0.1)
      entity.integrate(1.3, 0.01)

      expect(entity.position).not.toEqual(V(10, 10))
    })

    test('cannot be controlled if moveForce === 0', () => {
      entity.moveForce = 0
      entity.applyControls({ pX: 100, pY: 100, move: true })
      entity.integrate(0.8, 0.002)

      expect(entity.position).toEqual(V(10, 10))
    })

    test('should slow down if no force is applied', () => {
      entity.velocity = V(10, 10)

      let prevLength = entity.velocity.length()
      entity.integrate(0, 0.001)
      expect(prevLength).toBeGreaterThan(entity.velocity.length())

      prevLength = entity.velocity.length()
      entity.integrate(0.001, 0.002)
      expect(prevLength).toBeGreaterThan(entity.velocity.length())

      prevLength = entity.velocity.length()
      entity.integrate(0.001, 0.002)
      expect(prevLength).toBeGreaterThan(entity.velocity.length())
    })
  })

  describe('serialization', () => {
    const entity = Entity.create('a'.repeat(24), {
      mass:      11,
      moveForce: 12,
      position:  V(13, 14)
    })

    entity.receiveEffect({
      onReceive: jest.fn(),
      serializedLength: jest.fn(function () {
        return 10
      }),
      serialize(buffer, offset = 0) {
        buffer.write('X'.repeat(10), offset, offset + 10)
      }
    })

    entity.receiveEffect({
      onReceive: jest.fn(),
      serializedLength: jest.fn(function () {
        return 15
      }),
      serialize(buffer, offset = 0) {
        buffer.write('Z'.repeat(15), offset, offset + 15)
      }
    })

    test('should serialize correctly', () => {
      const buffer = Buffer.alloc(entity.serializedLength() + 10)
      entity.serialize(buffer, 10)

      let offset = 10

      expect(buffer.readUInt8(offset)).toBe(ENTITY)
      offset += 1

      expect(buffer.toString('utf8', offset, offset + 24)).toBe('a'.repeat(24))
      offset += 24

      expect(buffer.readDoubleBE(offset)).toBe(11)
      offset += 8

      expect(buffer.readDoubleBE(offset)).toBe(12)
      offset += 8

      expect(buffer.readDoubleBE(offset)).toBe(13)
      offset += 8

      expect(buffer.readDoubleBE(offset)).toBe(14)
      offset += 8

      expect(buffer.readUInt8(offset)).toBe(2)
      offset += 1

      expect(buffer.toString('utf8', offset, offset + 10)).toBe('X'.repeat(10))
      offset += 10

      expect(buffer.toString('utf8', offset, offset + 15)).toBe('Z'.repeat(15))
      offset += 15
    })
  })
})