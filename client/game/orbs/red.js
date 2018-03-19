/**
 * @module client/game/orbs/red
 */

import Orb from './orb'

import { ORBS } from '@common/const'

/** @class */
class Red extends Orb {
  constructor(id, options = {}) {
    super(id, options)

    this.nodes.middle.setAttributeNS(null, 'fill', 'rgb(174, 17, 31)')
  }

  parse(buffer, offset = 0) {
    offset = super.parse(buffer, offset)

    this.maxStamina = buffer.readUInt16BE(offset)
    offset += 2

    this.stamina = buffer.readUInt16BE(offset)
    offset += 2

    return offset
  }
}

export default Red