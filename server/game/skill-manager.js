/**
 * @module server/game/skill-manager
 */

const forIn = require('lodash/forIn')

/**
 * @class
 */
class SkillManager {
  /**
   * Create a new skill manager for the specified orb.
   *
   * @param {Orb}    owner
   * @param {object} skills - Skills that the orb can use.
   */
  constructor(owner, skills) {
    this.owner = owner
    this.skills = skills

    this.controls = Object.create(null)
  }

  /**
   * Invoke skill callbacks depending on controls.
   *
   * @param {object} controls
   */
  handleControls(controls) {
    forIn(controls, (state, name) => {
      if (!this.controls[name] && state === true) {
        const skill = this.skills[name]
        if (skill) {
          skill.onDown(this.owner)
        }
      }

      else if (this.controls[name] === true && state === false) {
        const skill = this.skills[name]
        if (skill) {
          skill.onUp(this.owner)
        }
      }

      this.controls[name] = state
    })
  }
}

module.exports = SkillManager