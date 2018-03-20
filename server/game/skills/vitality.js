/**
 * @module server/game/skills/vitality
 */

const Skill = require('./skill')

const { ACTIVE, READY } = require('../../../common/skill-state')

const DELAY      = 2.0
const HP_RESTORE = 0.05

/** @class */
class Vitality extends Skill {
  /**
   * @param {object} options
   * @param {object} skillAPI
   */
  constructor(options, skillAPI) {
    super(options, skillAPI)

    this.refresh()
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
        this.state = { type: ACTIVE }
      }
    } else if (this.state.type === ACTIVE) {
      if (this.firstTick) {
        this.firstTick = false
        owner.once('damage', (dmg) => { this.refresh() })
      }

      owner.hp += owner.maxHP * HP_RESTORE * dt
    }
  }

  refresh() {
    this.state     = { type: READY }
    this.timer     = DELAY
    this.firstTick = true
  }
}

module.exports = Vitality