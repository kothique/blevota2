/**
 * @module sevrer/game/skills/vision
 */

const Skill = require('./skill')

const { ACTIVE } = require('../../../common/skill-state')

/** @const */
const RADIUS = 300

/** @class */
class Vision extends Skill {
  constructor(options, skillAPI) {
    super(options, skillAPI)

    this.state = { type: ACTIVE }
  }

  onTick(owner, t, dt) {
    this.api.getOrbsInCircle({ centerP: owner.position, radius: RADIUS })
      .forEach(orb => {
        if (orb !== owner) {
          orb.revealed = true
        }
      })
  }
}

module.exports = Vision