/**
 * @module client/game/orbs/green
 */

import { List } from 'immutable'

import Orb          from './orb'
import HiddenStrike from '../skills/hidden-strike'

import { ORBS } from '@common/const'

/** @class */
class Green extends Orb {
  constructor(id, options = {}) {
    super(id, options)

    this.skills = [
      this.api.createSkill(HiddenStrike, { owner: this })
    ]

    this.maxStamina = 0
    this.stamina    = 0
  }

  /** @override */
  get color() { return 'rgb(30, 147, 58)' }

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
  parseSkillsForSkillBox(buffer, offset = 0) {
    let skills = List([
      [ 'invisibility',  'Q' ],
      [ 'hidden-strike', 'W' ],
      // [ 'attack',    'RMB'  ]
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

export default Green