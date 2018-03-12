/**
 * @module server/game/skills/invisibility
 */

const Skill = require('./skill')

const { READY, ACTIVE } = require('../../../common/skill-state')

/**
 * @class
 */
class Invisibility extends Skill {
  onDown(owner) {
    if (this.state.type === READY) {
      this.state = { type: ACTIVE }

      if (owner.visible) {
        owner.events.once('show', () => this.state = { type: READY })
      }

      owner.hide()
    }
  }

  onUp(owner) {
    if (this.state.type === ACTIVE) {
      this.state = { type: READY }

      owner.show()
    }
  }
}

module.exports = Invisibility