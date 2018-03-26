/**
 * @module server/game/skill/let-loose
 */

const Skill = require('./skill')

const { ACTIVE, READY } = require('../../../common/skill-state')

const VALUE = 1.0

class LetLoose extends Skill {
  /**
   * Apply speed up effect.
   *
   * @param {Orb} owner
   * @override
   */
  onDown(owner) {
    this.state = { type: ACTIVE }

    owner.dragForceFactor -= VALUE
  }

  /**
   * Remove speed up effect.
   *
   * @param {Orb} owner
   * @override
   */
  onUp(owner) {
    this.state = { type: READY }

    owner.dragForceFactor += VALUE
  }

  serializeForOrb(buffer, offset = 0) {
    buffer.writeUInt8(this.state.type === ACTIVE, offset++)
  }

  get binaryLengthForOrb() { return 1 }
}

module.exports = LetLoose