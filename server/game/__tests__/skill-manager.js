const SkillManager = require('../skill-manager')

describe('SkillManager', () => {
  const orb = {
    receiveEffect: jest.fn(),
    removeEffect: jest.fn()
  }

  const skills = {
    someSkill: {
      onDown: jest.fn(),
      onUp: jest.fn()
    },

    anotherSkill: {
      onDown: jest.fn(),
      onUp: jest.fn()
    }
  }

  let manager

  beforeEach(() => {
    orb.receiveEffect.mockClear()
    orb.removeEffect.mockClear()

    skills.someSkill.onDown.mockClear()
    skills.someSkill.onUp.mockClear()

    skills.anotherSkill.onDown.mockClear()
    skills.anotherSkill.onUp.mockClear()

    manager = new SkillManager(orb, skills)
  })

  test('up is default skill state', () => {
    manager.handleControls({
      someSkill: false
    })

    expect(skills.someSkill.onUp).not.toBeCalled()
  })

  test('should call onDown()', () => {
    manager.handleControls({
      someSkill: true
    })

    expect(skills.someSkill.onDown).toBeCalled()
  })

  test('should call onUp()', () => {
    manager.handleControls({
      someSkill: true
    })

    manager.handleControls({
      someSkill: false
    })

    expect(skills.someSkill.onUp).toBeCalled()
  })

  test('more than one skill', () => {
    manager.handleControls({
      someSkill: false,
      anotherSkill: true
    })

    expect(skills.someSkill.onDown).not.toBeCalled()
    expect(skills.anotherSkill.onDown).toBeCalled()

    manager.handleControls({
      someSkill: true,
      anotherSkill: false
    })

    expect(skills.someSkill.onDown).toBeCalled()
    expect(skills.anotherSkill.onUp).toBeCalled()
  })
})