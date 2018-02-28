import Unknown from '../unknown'

describe('Unknown', () => {
  const type = 0x42

  let effect

  beforeEach(() => {
    effect = new Unknown(type)
  })

  test('should have type', () => {
    expect(effect.type).toBeDefined()
  })
})