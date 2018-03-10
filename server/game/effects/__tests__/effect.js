const Effect = require('../effect')

describe('Effect', () => {
  test('this.alive should be false after calling die()', () => {
    const effect = new Effect(null, null)

    expect(effect.alive).toBeTruthy()
    effect.die()
    expect(effect.alive).toBeFalsy()
  })

  test('this.effectAPI should be defined', () => {
    const effectAPI = {},
          effect = new Effect(null, effectAPI)

    expect(effect.api).toBeDefined()
    expect(effect.api).toBe(effectAPI)
  })
})