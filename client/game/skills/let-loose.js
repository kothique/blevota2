/**
 * @module client/game/skills/let-loose
 */

import Skill from './skill'

const RADIUS = 20

/** @class */
class LetLoose extends Skill {
  constructor(options) {
    super(options)

    this.nodes.letLoose = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    this.nodes.letLoose.setAttributeNS(null, 'fill', 'url(#let-loose-gradient)')
    this.nodes.letLoose.setAttributeNS(null, 'visibility', 'hidden')
    this.node.insertBefore(this.nodes.letLoose, this.nodes.outer)
  }

  startAnimation(t) {
    this.nodes.letLoose.setAttributeNS(null, 'visibility', 'visible')
  }

  animate(viewport, t, dt) {
    this.nodes.letLoose.setAttributeNS(null, 'r', Number(this.nodes.outer.getAttributeNS(null, 'r')) + RADIUS)
  }

  endAnimation(t) {
    this.nodes.letLoose.setAttributeNS(null, 'visibility', 'hidden')
  }
}

export default LetLoose