/**
 * @module client/game/decorator
 */

import { Vector, V } from '@common/vector'

import Border from '@client/game/decorations/border'

/**
 * @class
 */
const Decorator = {
  /**
   * Initialize the decorator.
   *
   * @param {object} options 
   * @param {Node}   options.svg
   */
  init(options) {
    this.clear()

    this.svg = options.svg

    this.border = new Border
    this.svg.appendChild(this.border.node)
  },

  /**
   * Remove all decorations.
   */
  clear() {
    if (this.svg) {
      this.svg.removeChild(this.border.node)
    }

    this.border = null
    this.svg = null
  },

  /**
   * Render decorations.
   *
   * @param {object} options - The information necessary to render the world.
   * @param {Vector} options.worldSize
   * @param {Vector} options.viewport
   */
  render(options) {
    const { worldSize, viewport } = options

    this.svg.style.backgroundPosition = `${-viewport.x % 64}px ${-viewport.y % 64}px`
    this.border.render(worldSize, viewport)
  }
}

export default Decorator