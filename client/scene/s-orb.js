/**
 * @module client/scene/s-orb
 */

import { SVG } from '../../common/util'
import { Vector, V } from '../../common/vector'

export default class SOrb {
  /**
   * Create a new SOrb.
   */
  constructor() {
    this.position = V(0, 0)
    this.radius = 0
    this.hpValue = 0
    this.mpValue = 0

    this.circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    this.circle.setAttributeNS(null, 'fill', 'rgb(50, 150, 80)')
    this.circle.setAttributeNS(null, 'fill-opacity', '0.7')
    this.circle.setAttributeNS(null, 'stroke', 'black')
    this.circle.setAttributeNS(null, 'stroke-width', '3px')
    this.circle.setAttributeNS(null, 'cx', 0)
    this.circle.setAttributeNS(null, 'cy', 0)
    this.circle.setAttributeNS(null, 'r',  0)

    this.hp = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    this.hp.setAttributeNS(null, 'fill', 'red')
    this.hp.setAttributeNS(null, 'fill-opacity', '0.7')
    this.hp.setAttributeNS(null, 'stroke', 'black')
    this.hp.setAttributeNS(null, 'stroke-width', '0')
    this.hp.setAttributeNS(null, 'transform', 'rotate(30)')

    this.mp = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    this.mp.setAttributeNS(null, 'fill', 'blue')
    this.mp.setAttributeNS(null, 'fill-opacity', '0.7')
    this.mp.setAttributeNS(null, 'stroke', 'black')
    this.mp.setAttributeNS(null, 'stroke-width', '0')
    this.mp.setAttributeNS(null, 'transform', 'rotate(210)')
    
    this.group = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    this.group.appendChild(this.circle)
    this.group.appendChild(this.hp)
    this.group.appendChild(this.mp)
  }

  /**
   * Update and render the orb.
   *
   * @param {object} options - Options.
   * @chainable
   *
   * Options must be as follows:
   *  radius:   number,
   *  position: Vector,
   *  maxHp:    number,
   *  hp:       number,
   *  maxMp:    number,
   *  mp:       number
   */
  render(options) {
    const { radius, position, maxHp, hp, maxMp, mp } = options,
          hpValue = hp / maxHp,
          mpValue = mp / maxMp

    if (!radius.equals(this.radius, 1e-1)) {
      this.circle.setAttributeNS(null, 'r', radius)
      this.hp.setAttributeNS(null, 'd', SVG.circleBar(V(0, 0), radius * 0.8, radius, hpValue))
      this.mp.setAttributeNS(null, 'd', SVG.circleBar(V(0, 0), radius * 0.6, radius * 0.8, mpValue))
    }

    if (!hpValue.equals(this.hpValue) || !mpValue.equals(this.mpValue)) {
      this.hp.setAttributeNS(null, 'd', SVG.circleBar(V(0, 0), radius * 0.8, radius, hpValue))
      this.mp.setAttributeNS(null, 'd', SVG.circleBar(V(0, 0), radius * 0.6, radius * 0.8, mpValue))
    }

    if (!position.equals(this.position, 1e-2)) {
      this.group.setAttributeNS(null, 'transform', `translate(${position.x} ${position.y})`)
    }

    this.position = position
    this.radius = radius
    this.hpValue = hp / maxHp
    this.mpValue = mp / maxMp

    return this
  }

  /**
   * Set visibility of the DOM element.
   *
   * @param {string} visibility
   * @chainable
   */
  setVisibility(visibility) {
    this.group.setAttributeNS(null, 'visibility', visibility)

    return this
  }

  /**
   * Return the root SVG node of the orb.
   */
  getNode() {
    return this.group
  }
}