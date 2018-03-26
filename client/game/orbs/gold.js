/**
 * @module client/game/orbs/gold
 */

import { List } from 'immutable'

import Orb        from './orb'
import Immunity   from '@client/game/skills/immunity'
import Reflection from '@client/game/skills/reflection'
import Attack     from '@client/game/skills/attack'

import { ORBS } from '@common/const'

/** @class */
class Gold extends Orb {
  constructor(id, options = {}) {
    super(id, options)

    this.skills = [
      this.api.createSkill(Immunity,   { owner: this }),
      this.api.createSkill(Reflection, { owner: this }),
      this.api.createSkill(Attack,     { owner: this })
    ]

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
  
  parseSkillsForSkillBox(buffer, offset = 0) {
    let skills = List([
      [ 'immunity',      'Q'    ],
      [ 'reflection',    'W'    ],
      [ 'attack',        'RMB'  ]
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

export default Gold