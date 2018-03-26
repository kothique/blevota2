/**
 * @module client/game/skills/reflection
 */

import Skill from './skill'

/** @class */
class Reflection extends Skill {
  constructor(options) {
    super(options)

    this.progress = 0

    this.nodes.reflection = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    this.nodes.reflection.setAttributeNS(null, 'fill', 'none')
    this.nodes.reflection.setAttributeNS(null, 'stroke', this.owner.color)
    this.nodes.reflection.setAttributeNS(null, 'stroke-opacity', 0.3)
    this.nodes.reflection.setAttributeNS(null, 'stroke-dasharray', '5 5')
    this.nodes.reflection.setAttributeNS(null, 'visibility', 'hidden')
    this.node.insertBefore(this.nodes.reflection, this.nodes.outer)
  }

  startAnimation(t) {
    this.progress = 0
    this.initialOpacity = this.nodes.inner.getAttributeNS(null, 'fill-opacity')
    this.nodes.reflection.setAttributeNS(null, 'visibility', 'visible')
  }

  animate(viewport, t, dt) {
    this.nodes.inner.setAttributeNS(null, 'fill-opacity', 0.3 * (1 - this.progress / 255))
    this.nodes.reflection.setAttributeNS(null, 'r', this.radius)
  }

  endAnimation(t) {
    this.nodes.inner.setAttributeNS(null, 'fill-opacity', this.initialOpacity)
    this.nodes.reflection.setAttributeNS(null, 'visibility', 'hidden')
  }

  parse(buffer, offset = 0) {
    offset = super.parse(buffer, offset)

    this.radius   = buffer.readUInt16BE(offset)
    offset += 2

    this.progress = buffer.readUInt8(offset++)

    return offset
  }
}

export default Reflection