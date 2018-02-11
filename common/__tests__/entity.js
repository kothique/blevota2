const Entity = require('../entity')
const { V } = require('../vector')

describe('Entity', () => {
  test('construction with default options', () => {
    const entity = new Entity({
      radius: 1,
      mass: 2
    })

    expect(entity.radius).toBe(1)
    expect(entity.mass).toBe(2)
    expect(entity.moveForce).toBe(0)
    expect(entity.position).toEqual(V(0 ,0))
    expect(entity.velocity).toEqual(V(0 ,0))
    expect(entity.force).toEqual(V(0 ,0))
  })

  test('construction with custom options', () => {
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

    expect(entity.radius).toBe(1)
    expect(entity.mass).toBe(2)
    expect(entity.moveForce).toBe(3)
    expect(entity.position).toEqual(V(4, 5))
    expect(entity.velocity).toEqual(V(6, 7))
    expect(entity.force).toEqual(V(8, 9))
  })
})