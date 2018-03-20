/**
 * @module client/game/orbs/red
 */

import { List } from 'immutable'

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

  /**
   * @param {Buffer} buffer
   * @param {number} offset
   * @return {object}
   */
  parseSkills(buffer, offset = 0) {
    let skills = List([
      [ 'magnetism', 'Q'  ],
      [ 'shield',    'W'  ],
      [ 'vitality'        ]
    ]).map(([ name, shortcut ]) => {
      const result = Orb.parseSkill(buffer, offset)

      offset = result.offset

      return {
        name, shortcut,
        state: result.skill
      }
    })

    return { offset, skills }
  }
}

export default Red