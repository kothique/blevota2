const Effect = require('../effect')

describe('Effect', () => {
  test('this.alive should be false after calling die()', () => {
    const effect = new Effect

    expect(effect.alive).toBeTruthy()
    effect.die()
    expect(effect.alive).toBeFalsy()
  })
})