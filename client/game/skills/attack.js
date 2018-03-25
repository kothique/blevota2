/**
 * @module client/game/skills/attack
 */

import Skill from './skill'

/** @class */
class Attack extends Skill {
  constructor(options) {
    super(options)

    this.radius = 0

    this.nodes.attack = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    this.nodes.attack.setAttributeNS(null, 'fill', 'none')
    this.nodes.attack.setAttributeNS(null, 'stroke', 'white')
    this.nodes.attack.setAttributeNS(null, 'stroke-opacity', 0.7)
    this.nodes.attack.setAttributeNS(null, 'stroke-width', 2)
    this.nodes.attack.setAttributeNS(null, 'stroke-dasharray', '2 10')
    this.nodes.attack.setAttributeNS(null, 'cx', 0)
    this.nodes.attack.setAttributeNS(null, 'cy', 0)
    this.nodes.attack.setAttributeNS(null, 'r', 0)
    this.nodes.attack.setAttributeNS(null, 'visibility', 'hidden')
    this.node.insertBefore(this.nodes.attack, this.node.firstChild)
  }

  startAnimation(t) {
    this.nodes.attack.setAttributeNS(null, 'visibility', 'visible')
  }

  animate(viewport, t, dt) {
    this.nodes.attack.setAttributeNS(null, 'r', this.radius)
  }

  endAnimation(t) {
    this.nodes.attack.setAttributeNS(null, 'visibility', 'hidden')
  }

  parse(buffer, offset = 0) {
    offset = super.parse(buffer, offset)

    this.radius = buffer.readUInt16BE(offset)
    offset += 2

    return offset
  }
}

export default Attack