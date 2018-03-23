/**
 * @module client/game/decorations/background
 */

import { Vector, V } from '@common/vector'

/** @class */
class Background {
  /** @param {Node} svg */
  constructor(svg) {
    this.node = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    this.node.setAttributeNS(null, 'stroke', 'none')
    this.node.setAttributeNS(null, 'fill', 'url(#bg-fill)')

    this.pattern = document.getElementById('bg-fill')

    svg.appendChild(this.node)
  }

  /**
   * @param {Vector} worldSize
   * @param {Vector} viewport
   */
  render(worldSize, viewport) {
    this.node.setAttributeNS(null, 'x', -viewport.x)
    this.node.setAttributeNS(null, 'y', -viewport.y)
    this.node.setAttributeNS(null, 'width', worldSize.x)
    this.node.setAttributeNS(null, 'height', worldSize.y)

    this.pattern.setAttributeNS(null, 'patternTransform', `translate(${-viewport.x} ${-viewport.y})`)
  }
}

export default Background