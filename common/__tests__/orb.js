const Orb = require('../orb')
const { V } = require('../vector')

describe('orb', () => {
  test('construction with default options', () => {
    const orb = new Orb({
      radius: 1,
    })

    expect(orb.radius).toBe(1)
    expect(orb.mass).toBe(Orb.mass)
    expect(orb.moveForce).toBe(Orb.moveForce)
    expect(orb.position).toEqual(V(0 ,0))
    expect(orb.velocity).toEqual(V(0 ,0))
    expect(orb.force).toEqual(V(0 ,0))
  })

  test('construction with custom options', () => {
    const orb = new Orb({
      radius: 1,
      position: V(4, 5),
      velocity: V(6, 7),
      force: V(8, 9)
    })

    expect(orb.radius).toBe(1)
    expect(orb.mass).toBe(Orb.mass)
    expect(orb.moveForce).toBe(Orb.moveForce)
    expect(orb.position).toEqual(V(4, 5))
    expect(orb.velocity).toEqual(V(6, 7))
    expect(orb.force).toEqual(V(8, 9))
  })

  test('should move if moveForce is undefined', () => {
    const orb = new Orb({
      radius: 30,
      position: V(100, 100)
    })

    orb.applyControls({
      mX: 150,
      mY: 150,
      lmb: true,
      rmb: false,
      wheel: false
    })
    orb.integrate(0, 1)

    expect(orb.position.x).toBeGreaterThan(100)
    expect(orb.position.y).toBeGreaterThan(100)
  })

  test('move left', () => {
    const orb = new Orb({
      radius: 30,
      mass: 1,
      moveForce: 0.1,
      position: V(100, 100)
    })

    orb.applyControls({
      mX: 50,
      mY: 100,
      lmb: true,
      rmb: false,
      wheel: false
    })
    orb.integrate(0, 1)

    expect(orb.position.x).toBeLessThan(100)
  })

  test('move right', () => {
    const orb = new Orb({
      radius: 30,
      mass: 1,
      moveForce: 0.1,
      position: V(100, 100)
    })

    orb.applyControls({
      mX: 150,
      mY: 100,
      lmb: true,
      rmb: false,
      wheel: false
    })
    orb.integrate(0, 1)

    expect(orb.position.x).toBeGreaterThan(100)
  })

  test('move up', () => {
    const orb = new Orb({
      radius: 30,
      mass: 1,
      moveForce: 0.1,
      position: V(100, 100)
    })

    orb.applyControls({
      mX: 100,
      mY: 50,
      lmb: true,
      rmb: false,
      wheel: false
    })
    orb.integrate(0, 1)

    expect(orb.position.y).toBeLessThan(100)
  })

  test('move down', () => {
    const orb = new Orb({
      radius: 30,
      mass: 1,
      moveForce: 0.1,
      position: V(100, 100)
    })

    orb.applyControls({
      mX: 100,
      mY: 150,
      lmb: true,
      rmb: false,
      wheel: false
    })
    orb.integrate(0, 1)

    expect(orb.position.y).toBeGreaterThan(100)
  })

  test('serialization', () => {
    const buffer = Buffer.allocUnsafe(Orb.binaryLength)

    const original = new Orb({
      radius: 1,
      position: V(4, 5),
      velocity: V(6, 7),
      force: V(8, 9)
    })

    original.writeToBuffer(buffer, 0)
    const orb = Orb.fromBuffer(buffer, 0)

    expect(orb.radius).toBe(1)
    expect(orb.mass).toBe(Orb.mass)
    expect(orb.moveForce).toBe(Orb.moveForce)
    expect(orb.position).toEqual(V(4, 5))
    expect(orb.velocity).toEqual(V(6, 7))
    expect(orb.force).toEqual(V(8, 9))
  })
})