import Entity from '../../entity'
import '../orb'
import { ORB } from '../../../../common/entities'
import { SPEEDUP } from '../../../../common/effects'
import '../../effects/speedup'
import { Vector, V } from '../../../../common/vector'

describe('Orb', () => {
  test('has Orb.prototype.node property', () => {
    const buffer = Buffer.alloc(10 + 98)
    buffer.writeUInt8(ORB, 10)
    buffer.write('a'.repeat(24), 10 + 1, 24)
    buffer.writeDoubleBE(101, 10 + 1 + 24)
    buffer.writeDoubleBE(102, 10 + 1 + 24 + 8)
    buffer.writeDoubleBE(103, 10 + 1 + 24 + 8 + 8)
    buffer.writeDoubleBE(104, 10 + 1 + 24 + 8 + 8 + 8)
    buffer.writeDoubleBE(105, 10 + 1 + 24 + 8 + 8 + 8 + 8)
    buffer.writeUInt8   (0,   10 + 1 + 24 + 8 + 8 + 8 + 8 + 8)
    buffer.writeDoubleBE(106, 10 + 1 + 24 + 8 + 8 + 8 + 8 + 8 + 1)
    buffer.writeDoubleBE(107, 10 + 1 + 24 + 8 + 8 + 8 + 8 + 8 + 1 + 8)
    buffer.writeDoubleBE(108, 10 + 1 + 24 + 8 + 8 + 8 + 8 + 8 + 1 + 8 + 8)
    buffer.writeDoubleBE(109, 10 + 1 + 24 + 8 + 8 + 8 + 8 + 8 + 1 + 8 + 8 + 8)

    const { entity: orb, offset } = Entity.deserialize(buffer, 10)

    expect(orb.node).toBeDefined()
  })

  test('should deserialize correctly', () => {
    const buffer = Buffer.alloc(10 + 98)
    buffer.writeUInt8(ORB, 10)
    buffer.write('a'.repeat(24), 10 + 1, 24)
    buffer.writeDoubleBE(101, 10 + 1 + 24)
    buffer.writeDoubleBE(102, 10 + 1 + 24 + 8)
    buffer.writeDoubleBE(103, 10 + 1 + 24 + 8 + 8)
    buffer.writeDoubleBE(104, 10 + 1 + 24 + 8 + 8 + 8)
    buffer.writeDoubleBE(105, 10 + 1 + 24 + 8 + 8 + 8 + 8)
    buffer.writeUInt8   (0,   10 + 1 + 24 + 8 + 8 + 8 + 8 + 8)
    buffer.writeDoubleBE(106, 10 + 1 + 24 + 8 + 8 + 8 + 8 + 8 + 1)
    buffer.writeDoubleBE(107, 10 + 1 + 24 + 8 + 8 + 8 + 8 + 8 + 1 + 8)
    buffer.writeDoubleBE(108, 10 + 1 + 24 + 8 + 8 + 8 + 8 + 8 + 1 + 8 + 8)
    buffer.writeDoubleBE(109, 10 + 1 + 24 + 8 + 8 + 8 + 8 + 8 + 1 + 8 + 8 + 8)

    const { entity: orb, offset } = Entity.deserialize(buffer, 10)
    expect(orb.type).toBe(ORB)
    expect(orb.radius).toBe(101)
    expect(orb.mass).toBe(102)
    expect(orb.moveForce).toBe(103)
    expect(orb.position).toBeInstanceOf(Vector)
    expect(orb.position.x).toBe(104)
    expect(orb.position.y).toBe(105)
    expect(orb.effects.length).toBe(0)
    expect(orb.maxHp).toBe(106)
    expect(orb.hp).toBe(107)
    expect(orb.maxMp).toBe(108)
    expect(orb.mp).toBe(109)
  })

  test('should deserialize correctly with effects', () => {
    const buffer = Buffer.alloc(10 + 116)
    buffer.writeUInt8(ORB, 10)
    buffer.write('a'.repeat(24), 10 + 1, 24)
    buffer.writeDoubleBE(101,     10 + 1 + 24)
    buffer.writeDoubleBE(102,     10 + 1 + 24 + 8)
    buffer.writeDoubleBE(103,     10 + 1 + 24 + 8 + 8)
    buffer.writeDoubleBE(104,     10 + 1 + 24 + 8 + 8 + 8)
    buffer.writeDoubleBE(105,     10 + 1 + 24 + 8 + 8 + 8 + 8)

    /** effects: 2 */
    buffer.writeUInt8   (2,       10 + 1 + 24 + 8 + 8 + 8 + 8 + 8)

    /** speedup effect, value: 0.5 */
    buffer.writeUInt8   (SPEEDUP, 10 + 1 + 24 + 8 + 8 + 8 + 8 + 8 + 1)
    buffer.writeDoubleBE(0.5,     10 + 1 + 24 + 8 + 8 + 8 + 8 + 8 + 1 + 1)

    /** speedup effect, value: 0.3 */
    buffer.writeUInt8   (SPEEDUP, 10 + 1 + 24 + 8 + 8 + 8 + 8 + 8 + 1 + 1 + 8)
    buffer.writeDoubleBE(0.3,     10 + 1 + 24 + 8 + 8 + 8 + 8 + 8 + 1 + 1 + 8 + 1)

    buffer.writeDoubleBE(106,     10 + 1 + 24 + 8 + 8 + 8 + 8 + 8 + 1 + 1 + 8 + 1 + 8)
    buffer.writeDoubleBE(107,     10 + 1 + 24 + 8 + 8 + 8 + 8 + 8 + 1 + 1 + 8 + 1 + 8 + 8)
    buffer.writeDoubleBE(108,     10 + 1 + 24 + 8 + 8 + 8 + 8 + 8 + 1 + 1 + 8 + 1 + 8 + 8 + 8)
    buffer.writeDoubleBE(109,     10 + 1 + 24 + 8 + 8 + 8 + 8 + 8 + 1 + 1 + 8 + 1 + 8 + 8 + 8 + 8)

    const { entity: orb, offset } = Entity.deserialize(buffer, 10)
    expect(orb.type).toBe(ORB)
    expect(orb.radius).toBe(101)
    expect(orb.mass).toBe(102)
    expect(orb.moveForce).toBe(103)
    expect(orb.position).toBeInstanceOf(Vector)
    expect(orb.position.x).toBe(104)
    expect(orb.position.y).toBe(105)
    expect(orb.effects.length).toBe(2)
    expect(orb.maxHp).toBe(106)
    expect(orb.hp).toBe(107)
    expect(orb.maxMp).toBe(108)
    expect(orb.mp).toBe(109)
  })

  test('extrapolates position linearly', () => {
    const buffer = Buffer.alloc(10 + 116)
    buffer.writeUInt8(ORB, 10)
    buffer.write('a'.repeat(24), 10 + 1, 24)
    buffer.writeDoubleBE(101,     10 + 1 + 24)
    buffer.writeDoubleBE(102,     10 + 1 + 24 + 8)
    buffer.writeDoubleBE(103,     10 + 1 + 24 + 8 + 8)

    /** position */
    buffer.writeDoubleBE(500,     10 + 1 + 24 + 8 + 8 + 8)
    buffer.writeDoubleBE(500,     10 + 1 + 24 + 8 + 8 + 8 + 8)

    buffer.writeUInt8   (0,       10 + 1 + 24 + 8 + 8 + 8 + 8 + 8)
    buffer.writeDoubleBE(106,     10 + 1 + 24 + 8 + 8 + 8 + 8 + 8 + 1 + 1 + 8 + 1 + 8)
    buffer.writeDoubleBE(107,     10 + 1 + 24 + 8 + 8 + 8 + 8 + 8 + 1 + 1 + 8 + 1 + 8 + 8)
    buffer.writeDoubleBE(108,     10 + 1 + 24 + 8 + 8 + 8 + 8 + 8 + 1 + 1 + 8 + 1 + 8 + 8 + 8)
    buffer.writeDoubleBE(109,     10 + 1 + 24 + 8 + 8 + 8 + 8 + 8 + 1 + 1 + 8 + 1 + 8 + 8 + 8 + 8)

    const { entity: orb } = Entity.deserialize(buffer, 10)
    expect(orb.position.x).toBeCloseTo(500)
    expect(orb.position.y).toBeCloseTo(500)

    /** change position */
    buffer.writeDoubleBE(1000,     10 + 1 + 24 + 8 + 8 + 8)
    buffer.writeDoubleBE(1000,     10 + 1 + 24 + 8 + 8 + 8 + 8)
    orb.parse(buffer, 10 + 1 + 24) // 10 + type(1) + id(24)
    expect(orb.position.x).toBeCloseTo(1000)
    expect(orb.position.y).toBeCloseTo(1000)

    /** extrapolate */
    orb.extrapolate({
      prev: 100,
      curr: 200,
      next: 300
    })
    expect(orb.position.x).toBeCloseTo(1500)
    expect(orb.position.y).toBeCloseTo(1500)
  })
})
