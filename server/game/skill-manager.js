/**
 * @module server/game/skill-manager
 */

const Attack = require('./skills/attack')

/** @class */
class SkillManager {
  /**
   * Create a new skill manager for the specified orb.
   *
   * @param {Orb}     owner
   * @param {?object} skills - Skills that the orb can use.
   * @param {?object} attack - Attack skill.
   */
  constructor(owner, skills = [], attack = null) {
    this.owner = owner
    this.skills = skills
    this.attack = attack || owner.api.createSkill(Attack)

    this.controls = {
      attack: false,
      skills: []
    }
  }

  /**
   * Invoke skill callbacks depending on controls.
   *
   * @param {object} controls
   */
  handleControls(controls) {
    const { attack, skills } = controls

    console.log(controls)

    skills.forEach((state, index) => {
      if (!this.controls.skills[index] && state === true) {
        const skill = this.skills[index]
        skill && skill.onDown(this.owner)
      }

      else if (this.controls.skills[index] && state === false) {
        const skill = this.skills[index]
        skill && skill.onUp(this.owner)
      }

      if (state !== null) {
        this.controls.skills[index] = state
      }
    })

    {
      if (!this.controls.attack && attack === true) {
        this.attack.onDown(this.owner)
      } else if (this.controls.attack && attack === false) {
        this.attack.onUp(this.owner)
      }

      if (attack !== null) {
        this.controls.attack = attack
      }
    }
  }

  tickSkills(t, dt) {
    this.skills.forEach(skill => skill.onTick(this.owner, t, dt))
    this.attack.onTick(this.owner, t, dt)
  }

  serializeForOrb(buffer, offset = 0) {
    this.skills.forEach(skill => {
      skill.serializeForOrb(buffer, offset)
      offset += skill.binaryLengthForOrb
    })

    this.attack.serializeForOrb(buffer, offset)
    offset += this.attack.binaryLengthForOrb
  }

  get binaryLengthForOrb() {
    return this.attack.binaryLengthForOrb + this.skills.reduce((acc, skill) => acc + skill.binaryLengthForOrb, 0)
  }

  serializeForSkillBox(buffer, offset = 0) {
    this.skills.forEach(skill => {
      skill.serializeForSkillBox(buffer, offset)
      offset += skill.binaryLengthForSkillBox
    })

    this.attack.serializeForSkillBox(buffer, offset)
    offset += this.attack.binaryLengthForSkillBox
  }

  get binaryLengthForSkillBox() {
    return this.attack.binaryLengthForSkillBox + this.skills.reduce((acc, skill) => acc + skill.binaryLengthForSkillBox, 0)
  }
}

module.exports = SkillManager