const Entity = require('../entity')
const Effect = require('../effect')
const { V } = require('../vector')

jest.mock('../effect')

describe('Entity', () => {
  test('construction', () => {
    const entity = new Entity({
      radius: 1,
      mass: 2,
      moveForce: 3,
      position: V(4, 5),
      velocity: V(6, 7),
      force: V(8, 9)
    })

    expect(entity.radius).toBe(1)
    expect(entity.mass).toBe(2)
    expect(entity.moveForce).toBe(3)
    expect(entity.position).toEqual(V(4, 5))
    expect(entity.velocity).toEqual(V(6, 7))
    expect(entity.force).toEqual(V(8, 9))
  })

  test('should not move if moveForce is undefined', () => {
    const entity = new Entity({
      radius: 30,
      mass: 1,
      position: V(100, 100)
    })

    entity.applyControls({
      mX: 150,
      mY: 150,
      lmb: true,
      rmb: false,
      wheel: false
    })
    entity.integrate(0, 1)

    expect(entity.position).toEqual(V(100, 100))
  })

  test('move left', () => {
    const entity = new Entity({
      radius: 30,
      mass: 1,
      moveForce: 0.1,
      position: V(100, 100)
    })

    entity.applyControls({
      mX: 50,
      mY: 100,
      lmb: true,
      rmb: false,
      wheel: false
    })
    entity.integrate(0, 1)

    expect(entity.position.x).toBeLessThan(100)
  })

  test('move right', () => {
    const entity = new Entity({
      radius: 30,
      mass: 1,
      moveForce: 0.1,
      position: V(100, 100)
    })

    entity.applyControls({
      mX: 150,
      mY: 100,
      lmb: true,
      rmb: false,
      wheel: false
    })
    entity.integrate(0, 1)

    expect(entity.position.x).toBeGreaterThan(100)
  })

  test('move up', () => {
    const entity = new Entity({
      radius: 30,
      mass: 1,
      moveForce: 0.1,
      position: V(100, 100)
    })

    entity.applyControls({
      mX: 100,
      mY: 50,
      lmb: true,
      rmb: false,
      wheel: false
    })
    entity.integrate(0, 1)

    expect(entity.position.y).toBeLessThan(100)
  })

  test('move down', () => {
    const entity = new Entity({
      radius: 30,
      mass: 1,
      moveForce: 0.1,
      position: V(100, 100)
    })

    entity.applyControls({
      mX: 100,
      mY: 150,
      lmb: true,
      rmb: false,
      wheel: false
    })
    entity.integrate(0, 1)

    expect(entity.position.y).toBeGreaterThan(100)
  })

  test('should receive effects', () => {
    const entity = new Entity({
      radius: 30,
      mass: 1,
      moveForce: 0.1,
      position: V(100, 100)
    })

    const effect = new Object
    effect.apply = jest.fn()

    entity.receive(effect)
    expect(entity.effects.length).toBe(1)

    entity.applyEffects(0.01)
    entity.applyEffects(0.01)

    expect(effect.apply.mock.calls.length).toBe(2)
    expect(effect.apply.mock.calls[0][0]).toBe(entity)
    expect(effect.apply.mock.calls[1][0]).toBe(entity)
  })

  test('should remove dead effects', () => {
    const entity = new Entity({
      radius: 30,
      mass: 1,
      moveForce: 0.1,
      position: V(100, 100)
    })

    const effect = new Object
    effect.timeToDie = 0.02
    effect.alive = true
    effect.apply = jest.fn(function (target, timestep) {
      this.timeToDie -= timestep

      if (this.timeToDie <= 0) {
        this.alive = false
      }
    })

    entity.receive(effect)
    expect(entity.effects.length).toBe(1)

    entity.applyEffects(0.01)
    expect(entity.effects.length).toBe(1)

    entity.applyEffects(0.01)
    entity.applyEffects(0.01) // to make sure effect.timeToDie < 0.02
    expect(effect.alive).toBeFalsy()
    expect(entity.effects.length).toBe(0)
  })

  test('serialization', () => {
    const buffer = Buffer.allocUnsafe(Entity.binaryLength)

    const original = new Entity({
      radius: 1,
      mass: 2,
      moveForce: 3,
      position: V(4, 5),
      velocity: V(6, 7),
      force: V(8, 9)
    })

    original.writeToBuffer(buffer, 0)
    const entity = Entity.fromBuffer(buffer, 0)

    expect(entity).toBeInstanceOf(Entity)
    expect(entity.radius).toBe(1)
    expect(entity.mass).toBe(2)
    expect(entity.moveForce).toBe(3)
    expect(entity.position).toEqual(V(4, 5))
    expect(entity.velocity).toEqual(V(6, 7))
    expect(entity.force).toEqual(V(8, 9))
  })
})