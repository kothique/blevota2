const Orb = require('../orb')
const { V } = require('../vector')

describe('orb', () => {
  test('construction', () => {
    const orb = new Orb({
      mass: 2,
      moveForce: 0.1,
      radius: 1,
      position: V(4, 5),
      velocity: V(6, 7),
      force: V(8, 9),
      maxHp: 100,
      hp: 80,
      maxMp: 200,
      mp: 90
    })

    expect(orb.radius).toBe(1)
    expect(orb.mass).toBe(2)
    expect(orb.moveForce).toBe(0.1)
    expect(orb.position).toEqual(V(4, 5))
    expect(orb.velocity).toEqual(V(6, 7))
    expect(orb.force).toEqual(V(8, 9))
    expect(orb.maxHp).toBe(100)
    expect(orb.hp).toBe(80)
    expect(orb.maxMp).toBe(200)
    expect(orb.mp).toBe(90)
  })

  test('serialization', () => {
    const buffer = Buffer.allocUnsafe(Orb.binaryLength)

    const original = new Orb({
      mass: 1.7,
      moveForce: 0.15,
      radius: 1,
      position: V(4, 5),
      velocity: V(6, 7),
      force: V(8, 9),
      maxHp: 100,
      hp: 80,
      maxMp: 200,
      mp: 90
    })

    original.writeToBuffer(buffer, 0)
    const orb = Orb.fromBuffer(buffer, 0)

    expect(orb).toBeInstanceOf(Orb)
    expect(orb.radius).toBe(1)
    expect(orb.mass).toBe(1.7)
    expect(orb.moveForce).toBe(0.15)
    expect(orb.position).toEqual(V(4, 5))
    expect(orb.velocity).toEqual(V(6, 7))
    expect(orb.force).toEqual(V(8, 9))
    expect(orb.maxHp).toBe(100)
    expect(orb.hp).toBe(80)
    expect(orb.maxMp).toBe(200)
    expect(orb.mp).toBe(90)
  })
})