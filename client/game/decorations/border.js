/**
 * @module client/game/decorations/border
 */

import { Vector, V } from '@common/vector'

/**
 * @class
 */
class Border {
  /**
   * Create a new border.
   */
  constructor() {
    this.node = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    this.node.setAttributeNS(null, 'stroke', 'rgb(216, 112, 130)')
    this.node.setAttributeNS(null, 'stroke-width', 4)
    this.node.setAttributeNS(null, 'fill', 'none')
  }

  /**
   * Render the border around the world.
   *
   * @param {Vector} worldSize
   * @param {Vector} viewport
   */
  render(worldSize, viewport) {
    this.node.setAttributeNS(null, 'x', -viewport.x + 'px')
    this.node.setAttributeNS(null, 'y', -viewport.y + 'px')
    this.node.setAttributeNS(null, 'width', worldSize.x)
    this.node.setAttributeNS(null, 'height', worldSize.y)
  }
}

export default Border