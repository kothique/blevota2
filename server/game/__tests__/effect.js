const Effect = require('../effect')

describe('Effect', () => {
  test('this.alives = false after die()', () => {
    const effect = Effect.create()

    expect(effect.alive).toBeTruthy()
    effect.die()
    expect(effect.alive).toBeFalsy()
  })
})