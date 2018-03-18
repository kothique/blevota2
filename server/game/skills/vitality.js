/**
 * @module server/game/skills/vitality
 */

const Skill = require('./skill')

const { ACTIVE, READY } = require('../../../common/skill-state')

const DELAY      = 1.0
const HP_RESTORE = 0.05

/** @class */
class Vitality extends Skill {
  constructor(options, skillAPI) {
    super(options, skillAPI)

    this.state = { type: READY }
    this.timer = DELAY
  }

  /**
   * @param {RedOrb} owner
   * @param {number} t
   * @param {number} dt
   */
  onTick(owner, t, dt) {
    if (this.state.type === READY) {
      this.timer -= dt

      if (this.timer <= 0) {
        this.state.type  = { type: ACTIVE }
      }
    } else if (this.state.type === ACTIVE) {
      if (this.timer + dt > 0) {
        owner.events.once('damage', (dmg) => {
          this.timer = DELAY
          this.state = { type: READY }
        })
      }

      owner.hp += owner.maxHP * HP_RESTORE * dt
    }
  }
}

module.exports = Vitality