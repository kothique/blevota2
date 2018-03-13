/**
 * @module client/game/decorator
 */

import { Vector, V }  from '@common/vector'
import { getViewBox } from '@common/game'

import Border      from '@client/game/decorations/border'
import Letterboxer from '@client/game/decorations/letterboxer'

/**
 * @class
 */
class Decorator {
  /**
   * @param {object} options 
   * @param {Node}   options.svg
   */
  constructor(options) {
    this.svg = options.svg
    this.border = new Border(this.svg)
    this.letterboxer = new Letterboxer
  }

  /**
   * Render decorations.
   *
   * @param {object} options - The information necessary to render the world.
   * @param {Vector} options.worldSize
   * @param {Vector} options.viewport
   */
  render(options) {
    const { worldSize, viewport } = options,
          viewBox = getViewBox(this.svg),
          tileSize = 64

    this.svg.style.backgroundPosition = `${viewBox.minP.x + -viewport.x % tileSize}px ${viewBox.minP.y + -viewport.y % tileSize}px`
    this.svg.style.backgroundSize = `${tileSize}px ${tileSize}px`
    this.border.render(worldSize, viewport)
    this.letterboxer.render(viewBox)
  }
}

export default Decorator