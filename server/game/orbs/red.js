/**
 * @module server/game/orbs/red
 */

const Orb = require('./orb')

const { ORBS: { RED } } = require('../../../common/const')

/** @class */
class Red extends Orb {
  constructor(options, orbAPI) {
    super({
      ...options,
      skills: {

      }
    }, orbAPI)

    this.maxStamina = options.maxStamina
    this.stamina    = options.maxStamina
  }

  serialize(buffer, offset = 0) {
    super.serialize(buffer, offset)
    offset += super.binaryLength

    buffer.writeUInt16BE(this.maxStamina, offset)
    offset += 2

    buffer.writeUInt16BE(this.stamina, offset)
    offset += 2
  }

  get binaryLength() { return super.binaryLength + 4 }

  get type() { return RED }
}

module.exports = Red