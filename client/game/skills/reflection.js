/**
 * @module client/game/skills/reflection
 */

import Skill from './skill'

/** @class */
class Reflection extends Skill {
  constructor(options) {
    super(options)

    this.progress = 0
  }

  startAnimation(t) {
    this.progress = 0
    this.initialOpacity = this.nodes.inner.getAttributeNS(null, 'fill-opacity')
  }

  animate(viewport, t, dt) {
    this.nodes.inner.setAttributeNS(null, 'fill-opacity', 0.3 * (1 - this.progress / 255))
  }

  endAnimation(t) {
    this.nodes.inner.setAttributeNS(null, 'fill-opacity', this.initialOpacity)
  }

  parse(buffer, offset = 0) {
    offset = super.parse(buffer, offset)

    this.progress = buffer.readUInt8(offset++)

    return offset
  }
}

export default Reflection