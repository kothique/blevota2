const InstantDamage = require('../instant-damage')

describe('InstantDamage', () => {
  test('should inflict the required amount of damage only once', () => {
    const dmg = new InstantDamage(30),
          o   = { hp: 80 }

    dmg.apply(o)

    expect(o.hp).toBeCloseTo(50)
    expect(dmg.alive).toBeFalsy()
  })
})