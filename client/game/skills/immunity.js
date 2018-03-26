/**
 * @module client/game/skills/immunity
 */

import Skill from './skill'

/** @class */
class Immunity extends Skill {
  constructor(options) {
    super(options)

    this.nodes.immunity = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    this.nodes.immunity.setAttributeNS(null, 'cx', 0)
    this.nodes.immunity.setAttributeNS(null, 'cy', 0)
    this.nodes.immunity.setAttributeNS(null, 'stroke', 'none')
    this.nodes.immunity.setAttributeNS(null, 'fill', 'url(#immunity-fill)')
    this.nodes.immunity.setAttributeNS(null, 'visibility', 'hidden')
    this.node.insertBefore(this.nodes.immunity, this.nodes.inner)
  }

  startAnimation(t) {
    this.nodes.immunity.setAttributeNS(null, 'visibility', 'visible')
  }

  animate(t, dt) {
    this.nodes.immunity.setAttributeNS(null, 'r', this.nodes.middle.getAttributeNS(null, 'r'))
  }

  endAnimation(t) {
    this.nodes.immunity.setAttributeNS(null, 'visibility', 'hidden')
  }
}

export default Immunity