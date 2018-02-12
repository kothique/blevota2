/**
 * @module client/scene/s-orb
 */

export default class SOrb {
  /**
   * Create a new SOrb.
   */
  constructor() {
    this.element = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    this.element.style.fill = 'rgb(150, 0, 30)'
    this.element.setAttributeNS(null, 'cx', 0)
    this.element.setAttributeNS(null, 'cy', 0)
    this.element.setAttributeNS(null, 'r',  0)
  }

  /**
   * Update and render the orb.
   *
   * @param {object} options - Options { radius: ?number, position: ?Vector }.
   * @chainable
   */
  render(options) {
    if (typeof options.radius !== 'undefined') {
      this.element.setAttributeNS(null, 'r', options.radius)
    }

    if (typeof options.position !== 'undefined') {
      this.element.setAttributeNS(null, 'cx', options.position.x)
      this.element.setAttributeNS(null, 'cy', options.position.y)
    }

    return this
  }

  /**
   * Set visibility of the DOM element.
   *
   * @param {string} visibility
   * @chainable
   */
  setVisibility(visibility) {
    this.element.setAttributeNS(null, 'visibility', visibility)

    return this
  }
}