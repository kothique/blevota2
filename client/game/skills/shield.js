/**
 * @module client/game/skills/shield
 */

import Skill from './skill'

/** @class */
class Shield extends Skill {
  constructor(options) {
    super(options)

    this.nodes.shield = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    this.nodes.shield.setAttributeNS(null, 'fill', `url(#shield-fill)`)
    this.nodes.shield.setAttributeNS(null, 'cx', 0)
    this.nodes.shield.setAttributeNS(null, 'cy', 0)
    this.nodes.shield.setAttributeNS(null, 'r', 0)
    this.nodes.shield.setAttributeNS(null, 'visibility', 'hidden')
    this.node.insertBefore(this.nodes.shield, this.nodes.inner)
  }

  startAnimation(t) {
    this.nodes.shield.setAttributeNS(null, 'visibility', 'visible')
  }

  animate(viewport, t, dt) {
    this.nodes.shield.setAttributeNS(null, 'r', this.nodes.middle.getAttributeNS(null, 'r'))
  }

  endAnimation(t) {
    this.nodes.shield.setAttributeNS(null, 'visibility', 'hidden')
  }
}

export default Shield