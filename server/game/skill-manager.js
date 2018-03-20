/**
 * @module server/game/skill-manager
 */

/** @class */
class SkillManager {
  /**
   * Create a new skill manager for the specified orb.
   *
   * @param {Orb}     owner
   * @param {?object} skills - Skills that the orb can use.
   */
  constructor(owner, skills = []) {
    this.owner = owner
    this.skills = skills

    this.controls = []
  }

  /**
   * Invoke skill callbacks depending on controls.
   *
   * @param {object} controls
   */
  handleControls(controls) {
    controls.forEach((state, index) => {
      if (!this.controls[index] && state === true) {
        const skill = this.skills[index]
        skill && skill.onDown(this.owner)
      }

      else if (this.controls[index] && state === false) {
        const skill = this.skills[index]
        skill && skill.onUp(this.owner)
      }

      if (state !== null) {
        this.controls[index] = state
      }
    })
  }
}

module.exports = SkillManager