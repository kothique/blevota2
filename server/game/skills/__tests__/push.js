const Push = require('../push')
const Magnetism = require('../../effects/magnetism')

describe('SlowDown', () => {
  let orb = {
    effects: [],
    receiveEffect: jest.fn(function (effect) {
      this.effects.push(effect)
    }),
    removeEffect: jest.fn(function (effect) {
      const index = this.effects.indexOf(effect)

      if (index >= 0) {
        this.effects.splice(index, 1)
      }
    })
  }

  const effectAPI = {
    queryBox: jest.fn()
                .mockImplementationOnce(() => [])
  }

  const skillAPI = {
    createEffect: jest.fn(function (constructor, options) {
      return new constructor(options, effectAPI)
    })
  }

  beforeEach(() => {
    orb.effects = []
    orb.receiveEffect.mockClear()
    orb.removeEffect.mockClear()

    effectAPI.queryBox.mockClear()

    skillAPI.createEffect.mockClear()
  })

  describe('onDown() & onUp()', () => {
    let skill = new Push({}, skillAPI)

    test('should apply effect on down', () => {
      skill.onDown(orb)

      expect(orb.receiveEffect).toBeCalled()
      expect(orb.effects).not.toHaveLength(0)
      expect(orb.effects[0]).toBeInstanceOf(Magnetism)
    })

    test('should remove effect on down', () => {
      skill.onDown(orb)
      skill.onUp(orb)

      expect(orb.removeEffect).toBeCalled()
      expect(orb.effects).toHaveLength(0)
    })
  })
})