/**
 * @module client/game/orbs/gold
 */

import Orb from './orb'

import { ORBS } from '@common/const'

/** @class */
class Gold extends Orb {
  constructor(id, options = {}) {
    super(id, options)

    this.maxMana = 0
    this.mana    = 0
  }

  /** @override */
  get color() { return 'rgb(245, 200, 14)' }

  parse(buffer, offset = 0) {
    offset = super.parse(buffer, offset)

    this.maxMana = buffer.readUInt16BE(offset)
    offset += 2

    this.mana = buffer.readUInt16BE(offset)
    offset += 2

    return offset
  }
}

export default Gold