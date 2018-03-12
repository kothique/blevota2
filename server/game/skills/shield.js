/**
 * @module server/game/skills/shield
 */

const Skill = require('./skill')
const { READY, ACTIVE } = require('../../../common/skill-state')

const VALUE = 0.5

/**
 * @class
 */
class Shield extends Skill {
  /**
   * @param {Orb} owner
   */
  onDown(owner) {
    this.state = { type: ACTIVE }

    owner.shield += VALUE
  }

  /**
   * @param {Orb} owner
   */
  onUp(owner) {
    this.state = { type: READY }

    owner.shield -= VALUE
  }
}

module.exports = Shield