/**
 * @module client/game/decorator
 */

import { Vector, V }               from '@common/vector'
import { getViewBox, svgToGlobal } from '@common/game'

import Border      from '@client/game/decorations/border'
import Background  from '@client/game/decorations/background'
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

    this.border      = new Border(this.svg)
    this.background  = new Background(this.svg)
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
          viewBox    = getViewBox(this.svg),
          tileWidth  = 16 * 28,
          tileHeight = 16 * 49

    this.border.render(worldSize, viewport)
    this.background.render(worldSize, viewport)
    this.letterboxer.render(viewBox)
  }
}

export default Decorator