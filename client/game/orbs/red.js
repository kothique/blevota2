/**
 * @module client/game/orbs/red
 */

import { List } from 'immutable'

import Orb       from './orb'
import Magnetism from '@client/game/skills/magnetism'
import Shield    from '@client/game/skills/shield'
import Attack    from '@client/game/skills/attack'

import { ORBS } from '@common/const'

/** @class */
class Red extends Orb {
  constructor(id, options = {}) {
    super(id, options)

    this.nodes.middle.setAttributeNS(null, 'fill', 'rgb(174, 17, 31)')

    this.skills = [
      new Magnetism({ owner: this }),
      new    Shield({ owner: this }),
      new    Attack({ owner: this })
    ]
  }

  parse(buffer, offset = 0) {
    offset = super.parse(buffer, offset)

    this.skills.forEach(skill => offset = skill.parse(buffer, offset))

    this.maxStamina = buffer.readUInt16BE(offset)
    offset += 2

    this.stamina = buffer.readUInt16BE(offset)
    offset += 2

    return offset
  }

  render(viewport, t, dt) {
    if (super.render(viewport, t, dt)) {
      this.skills.forEach(skill => skill.render(t, dt))
      this.nodes.shield.setAttributeNS(null, 'r', this.nodes.middle.getAttributeNS(null, 'r'))

      return true
    }

    return false
  }

  /**
   * @param {Buffer} buffer
   * @param {number} offset
   * @return {object}
   */
  parseSkillsForSkillBox(buffer, offset = 0) {
    let skills = List([
      [ 'magnetism', 'Q'    ],
      [ 'shield',    'W'    ],
      [ 'vitality'          ],
      [ 'attack',    'RMB'  ]
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