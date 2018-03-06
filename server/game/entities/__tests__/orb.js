const Orb    = require('../orb')
const Entity = require('../entity')

describe('Orb', () => {
  let orb

  beforeEach(() => {
    orb = new Orb({
      maxHp: 100,
      hp:    80,
      maxMp: 120,
      mp:    10
    })
  })

  test('should have default mass', () => {
    expect(orb.mass).toBeDefined()
  })

  test('should have default moveForce', () => {
    expect(orb.moveForce).toBeDefined()
  })

  test('should serialize correctly', () => {
    const length = orb.serializedLength(),
          buffer = Buffer.alloc(length)
    orb.serialize(buffer)

    let offset = length - 32

    expect(buffer.readDoubleBE(offset)).toBe(100)
    offset += 8

    expect(buffer.readDoubleBE(offset)).toBe(80)
    offset += 8

    expect(buffer.readDoubleBE(offset)).toBe(120)
    offset += 8

    expect(buffer.readDoubleBE(offset)).toBe(10)
    offset += 8
  })

  /** @todo */
  test('should serialize skills correctly')

  /** @todo */
  test('skillsToBuffer() is the same as serializeSkills(*new buffer*, 0)')
})