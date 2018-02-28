import Unknown from '../unknown'

describe('Unknown', () => {
  const type = 0x42,
        id = 'a'.repeat(24)

  let entity

  beforeEach(() => {
    entity = new Unknown(id, type)
  })

  test('should have type', () => {
    expect(entity.type).toBeDefined()
  })

  test('parse() should throw', () => {
    entity.parse = jest.fn(entity.parse)

    expect(entity.parse).toThrow()
  })
})