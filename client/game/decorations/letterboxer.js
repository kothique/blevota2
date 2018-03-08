/**
 * @module client/game/decoratinos/letterboxer
 */

/**
 * @class
 */
const Letterboxer = {
  /**
   * Initialize the letterboxer.
   */
  init() {
    this.bars = {}
     
    Array('top', 'bottom', 'left', 'right').forEach((side) => {
      this.bars[side] = document.getElementById(`gp-bar-${side}`)
    })
  },

  /**
   * Clear the instance.
   */
  clear() {},

  /**
   * Render the bars.
   *
   * @param {object} viewBox
   */
  render(viewBox) {
    const { minP, maxP } = viewBox

    this.bars.top.style.height = minP.y + 'px'
    this.bars.bottom.style.top = maxP.y + 'px'
    this.bars.left.style.width = minP.x + 'px'
    this.bars.right.style.left = maxP.x + 'px'
  }
}

export default Letterboxer