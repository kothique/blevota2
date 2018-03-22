/**
 * @module client/game/orbs/red
 */

import { List } from 'immutable'

import Orb from './orb'

import { ORBS } from '@common/const'

const MAGNETISM_DURATION = 500

/** @class */
class Red extends Orb {
  constructor(id, options = {}) {
    super(id, options)

    this.nodes.middle.setAttributeNS(null, 'fill', 'rgb(174, 17, 31)')

    /** Magnetism Skill */
    this.magnetism = {
      prevOn:   false,
      on:       false,
      radius:   0,
      progress: 0,
      startAnimation: () => {
        this.magnetism.progress = 0
        this.nodes.magnetism.setAttributeNS(null, 'visibility', 'visible')
      },
      animate: (dt) => {
        this.magnetism.progress += dt / MAGNETISM_DURATION
        if (this.magnetism.progress > 1) {
          this.magnetism.progress = 0
        }

        this.nodes.magnetism.setAttributeNS(null, 'r', this.magnetism.radius * (1 - this.magnetism.progress))
      },
      endAnimation: () => {
        this.nodes.magnetism.setAttributeNS(null, 'visibility', 'hidden')
      }
    }
    this.nodes.magnetism = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    this.nodes.magnetism.setAttributeNS(null, 'fill', 'none')
    this.nodes.magnetism.setAttributeNS(null, 'stroke', 'rgb(174, 17, 31)')
    this.nodes.magnetism.setAttributeNS(null, 'stroke-opacity', 0.7)
    this.nodes.magnetism.setAttributeNS(null, 'stroke-width', 2)
    this.nodes.magnetism.setAttributeNS(null, 'cx', 0)
    this.nodes.magnetism.setAttributeNS(null, 'cy', 0)
    this.nodes.magnetism.setAttributeNS(null, 'r', 0)
    this.nodes.magnetism.setAttributeNS(null, 'visibility', 'hidden')
    this.node.insertBefore(this.nodes.magnetism, this.node.firstChild)

    /** Shield Skill */
    this.shield = {
      prevOn: false,
      on:     false,
      startAnimation: ()   => this.nodes.shield.setAttributeNS(null, 'visibility', 'visible'),
      animate:        (dt) => {},
      endAnimation:   ()   => this.nodes.shield.setAttributeNS(null, 'visibility', 'hidden')
    }
    this.nodes.shield = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    this.nodes.shield.setAttributeNS(null, 'fill', `url(#shield-fill)`)
    this.nodes.shield.setAttributeNS(null, 'cx', 0)
    this.nodes.shield.setAttributeNS(null, 'cy', 0)
    this.nodes.shield.setAttributeNS(null, 'r', 0)
    this.nodes.shield.setAttributeNS(null, 'visibility', 'hidden')
    this.node.insertBefore(this.nodes.shield, this.nodes.inner)
  }

  parse(buffer, offset = 0) {
    offset = super.parse(buffer, offset)

    this.magnetism.prevOn = this.magnetism.on
    this.magnetism.on = buffer.readUInt8(offset++)
    if (this.magnetism.on) {
      this.magnetism.radius = buffer.readUInt16BE(offset)
      offset += 2
    }

    this.shield.prevOn = this.shield.on
    this.shield.on = buffer.readUInt8(offset++)

    this.maxStamina = buffer.readUInt16BE(offset)
    offset += 2

    this.stamina = buffer.readUInt16BE(offset)
    offset += 2

    return offset
  }

  render(viewport, t, dt) {
    if (super.render(viewport, t, dt)) {
      Array.of(
        'magnetism',
        'shield'
      ).forEach(name => {
        const skill = this[name]

        if (!this[name].prevOn && this[name].on) {
          this[name].startAnimation()
        } else if (this[name].prevOn && !this[name].on) {
          this[name].endAnimation()
        }

        if (this[name].on) {
          this[name].animate(dt)
        }
      })

      this.nodes.shield.setAttributeNS(null, 'r', this.nodes.middle.getAttributeNS(null, 'r'))
    }
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
      [ 'vitality'        ],
      [ 'attack',    'R'  ]
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