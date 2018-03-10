import Orb from '../orb'
import { ORB } from '@common/entities'
import { Vector, V } from '@common/vector'

describe('Orb', () => {
  let orb
  const id = 42,
        entityAPI = {
          createSkill: jest.fn(),
          createEffect: jest.fn()
        }

  beforeEach(() => {
    jest.resetModules()

    entityAPI.createSkill.mockClear()
    entityAPI.createEffect.mockClear()

    orb = new Orb(id, entityAPI)
  })

  test('has appropriate properties', () => {
    expect(orb.radius).toBeDefined()
    expect(orb.maxHp).toBeDefined()
    expect(orb.hp).toBeDefined()
    expect(orb.maxMp).toBeDefined()
    expect(orb.mp).toBeDefined()
    expect(orb.node).toBeDefined()
  })

  test('should parse info correctly', () => {
    const buffer = Buffer.alloc(10 + 17 + 5 * 8)

    buffer.writeDoubleBE(101, 10 + 0)
    buffer.writeDoubleBE(102, 10 + 8)
    buffer.writeUInt8(0, 10 + 16)

    buffer.writeDoubleBE(101, 10 + 17)
    buffer.writeDoubleBE(102, 10 + 17 + 8)
    buffer.writeDoubleBE(103, 10 + 17 + 16)
    buffer.writeDoubleBE(104, 10 + 17 + 24)
    buffer.writeDoubleBE(105, 10 + 17 + 32)

    orb.parse(buffer, 10)

    expect(orb.radius).toBe(101)
    expect(orb.maxHp).toBe(102)
    expect(orb.hp).toBe(103)
    expect(orb.maxMp).toBe(104)
    expect(orb.mp).toBe(105)
  })

  test('extrapolates position linearly', () => {
    const buffer = Buffer.alloc(10 + 17 + 7 * 8)

    buffer.writeDoubleBE(500, 10 + 0)
    buffer.writeDoubleBE(500, 10 + 8)
    buffer.writeUInt8(0, 10 + 16)

    buffer.writeDoubleBE(101, 10 + 17)
    buffer.writeDoubleBE(102, 10 + 17 + 8)
    buffer.writeDoubleBE(103, 10 + 17 + 16)
    buffer.writeDoubleBE(104, 10 + 17 + 24)
    buffer.writeDoubleBE(105, 10 + 17 + 32)
    buffer.writeDoubleBE(106, 10 + 17 + 40)
    buffer.writeDoubleBE(107, 10 + 17 + 48)

    orb.parse(buffer, 10)

    expect(orb.position.x).toBeCloseTo(500)
    expect(orb.position.y).toBeCloseTo(500)

    /** change position */
    buffer.writeDoubleBE(1000, 10 + 0)
    buffer.writeDoubleBE(1000, 10 + 8)
    orb.parse(buffer, 10)
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
