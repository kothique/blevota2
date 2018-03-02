const Skill = require('../skill')

describe('Skill', () => {
  let skill

  beforeEach(() => {
    skill = new Skill
  })

  test('should have state', () => {
    expect(skill.state).toBeDefined()
  })

  describe('serialization', () => {
    test('Skill.COOLDOWN state', () => {
      skill.state = {
        type: Skill.COOLDOWN,
        value: 1320
      }

      const length = skill.serializedLength(),
            buffer = Buffer.alloc(10 + length)

      skill.serialize(buffer, 10)

      expect(buffer.readUInt8(10 + 0)).toBe(Skill.COOLDOWN)
      expect(buffer.readUInt16BE(10 + 1)).toBe(1320)
    })

    const other = [
      Skill.READY,
      Skill.ACTIVE,
      Skill.NO_MANA
    ]

    for (const state of other) {
      test('other states', () => {
        skill.state = {
          type: state
        }

        const length = skill.serializedLength(),
              buffer = Buffer.alloc(10 + length)

        skill.serialize(buffer, 10)

        expect(buffer.readUInt8(10 + 0)).toBe(state)
      })
    }
  })
})