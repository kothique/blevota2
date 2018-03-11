/**
 * @module server/game/invisibility
 */

const Effect = require('./effect')

/**
 * @class
 */
class Invisibility extends Effect {
  onReceive(target) { target.invisible++ }
  onRemove(target) { target.invisible-- }
}

module.exports = Invisibility