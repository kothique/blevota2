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

  onReceive(target) { target._invisible++ }

  onRemove(target) {
    this.onEnd()
    target._invisible--
  }
}

module.exports = Invisibility