import Effect from '../effect'

describe('Effect', () => {
  let effect

  beforeEach(() => {
    effect = new Effect
  })

  test('parse() should do nothing', () => {
    const buffer = Buffer.alloc(10),
          offset = effect.parse(buffer, 10)

    expect(offset).toBe(10)
  })
})