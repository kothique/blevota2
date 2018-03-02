const Skill = require('../skill')

describe('Skill', () => {
  let skill

  beforeEach(() => {
    skill = new Skill
  })

  test('should have state', () => {
    expect(skill.state).toBeDefined()
  })
})