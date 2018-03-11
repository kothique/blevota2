const Skill = require('../skill')
const SkillState = require('../../../../common/skill-state')

describe('Skill', () => {
  let skill
  const skillAPI = {}

  beforeEach(() => {
    skill = new Skill(null, skillAPI)
  })

  test('should have state', () => {
    expect(skill.state).toBeDefined()
  })

  describe('serialization', () => {
    test('COOLDOWN state', () => {
      skill.state = {
        type: SkillState.COOLDOWN,
        value: 1320
      }

      const length = skill.binaryLength,
            buffer = Buffer.alloc(10 + length)

      skill.serialize(buffer, 10)

      expect(buffer.readUInt8(10 + 0)).toBe(SkillState.COOLDOWN)
      expect(buffer.readUInt16BE(10 + 1)).toBe(1320)
    })

    const other = [
      SkillState.READY,
      SkillState.ACTIVE,
      SkillState.NO_MANA
    ]

    for (const state of other) {
      test('other states', () => {
        skill.state = {
          type: state
        }

        const length = skill.binaryLength,
              buffer = Buffer.alloc(10 + length)

        skill.serialize(buffer, 10)

        expect(buffer.readUInt8(10 + 0)).toBe(state)
      })
    }
  })

  test('should accept skillAPI', () => {
    expect(skill.api).toBeDefined()
    expect(skill.api).toBe(skillAPI)
  })
})