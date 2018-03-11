/**
 * @module server/game/invisibility
 */

const Effect = require('./effect')

/**
 * @class
 */
class Invisibility extends Effect {
  constructor(options, effectAPI) {
    super(options, effectAPI)

    this.onEnd = options.onEnd
  }

  onReceive(target) { target.invisible++ }

  onRemove(target) {
    this.onEnd()
    target.invisible--
  }
}

module.exports = Invisibility