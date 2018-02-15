const Effect = require('../effect')

describe('Effect', () => {
  test('should change status on end', () => {
    const effect = new Effect
    effect.apply = function(target, dt) {
      target.hp -= 10 * dt // 10 hp per second
      this.end()
    }

    effect.apply({ hp: 30 })

    expect(effect.alive).toBeFalsy()
  })
})