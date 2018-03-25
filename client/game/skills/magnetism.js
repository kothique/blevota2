/**
 * @module client/game/skills/magnetism
 */

import Skill from './skill'

const MAGNETISM_DURATION = 500

/** @class */
class Magnetism extends Skill {
  constructor(options) {    
    super(options)

    this.radius   = 0
    this.progress = 0

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
  }

  startAnimation(viewport, t) {
    this.progress = 0
    this.nodes.magnetism.setAttributeNS(null, 'visibility', 'visible')
  }  

  animate(viewport, t, dt) {
    this.progress += dt / MAGNETISM_DURATION
    if (this.progress > 1) {
      this.progress = 0
    }

    this.nodes.magnetism.setAttributeNS(null, 'r', this.radius * (1 - this.progress))
  }

  endAnimation(viewport, t) {
    this.nodes.magnetism.setAttributeNS(null, 'visibility', 'hidden')
  }

  parse(buffer, offset = 0) {
    offset = super.parse(buffer, offset)

    if (this.on) {
      this.radius = buffer.readUInt16BE(offset)
      offset += 2
    }

    return offset
  }
}

export default Magnetism