/**
 * @module client/game/orbs/green
 */

import Orb from './orb'

import { ORBS } from '@common/const'

/** @class */
class Green extends Orb {
  constructor(id, options = {}) {
    super(id, options)

    this.nodes.middle.setAttributeNS(null, 'fill', 'rgb(30, 147, 58)')
  }

  parse(buffer, offset = 0) {
    offset = super.parse(buffer, offset)

    this.maxMana = buffer.readUInt16BE(offset)
    offset += 2

    this.mana = buffer.readUInt16BE(offset)
    offset += 2

    return offset
  }
}

export default Green