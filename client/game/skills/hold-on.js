/**
 * @module client/game/skills/hold-on
 */

import Skill from './skill'

const RADIUS = 20

/** @class */
class HoldOn extends Skill {
  constructor(options) {
    super(options)

    this.nodes.holdOn = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    this.nodes.holdOn.setAttributeNS(null, 'fill', 'url(#hold-on-gradient)')
    this.nodes.holdOn.setAttributeNS(null, 'visibility', 'hidden')
    this.node.insertBefore(this.nodes.holdOn, this.nodes.outer)
  }

  startAnimation(t) {
    this.nodes.holdOn.setAttributeNS(null, 'visibility', 'visible')
  }

  animate(viewport, t, dt) {
    this.nodes.holdOn.setAttributeNS(null, 'r', Number(this.nodes.outer.getAttributeNS(null, 'r'))  + RADIUS)
  }

  endAnimation(t) {
    this.nodes.holdOn.setAttributeNS(null, 'visibility', 'hidden')
  }
}

export default HoldOn