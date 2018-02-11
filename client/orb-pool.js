import { randomBytes } from "crypto";

/**
 * @module client/orb-pool
 */

/**
 * @class
 */
class OrbPool {
  /**
   * Create a new orb pool.
   *
   * @param {Node} svg - The svg element to put the orbs in.
   * @param {?number} preallocate - Number of orbs to pre-allocate.
   */
  constructor(svg, preallocate = 10) {
    this.svg = svg
    this.buffer = []

    this.allocate(preallocate)
  }

  /**
   * Allocate a number of orbs.
   *
   * @param {?number} n - Number of orbs to allocate.
   */
  allocate(n = 1) {
    for (let i = 0; i < n; i++) {
      const orb = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
      orb.style.fill = 'rgb(150, 0, 30)'
      orb.setAttributeNS(null, 'visibility', 'hidden')
      
      this.buffer.push(orb)
      this.svg.appendChild(orb)
    }
  }

  /**
   * Get an orb.
   */
  get() {
    if (!this.buffer.length)
      this.allocate(2)

    const orb =  this.buffer.shift()
    orb.setAttributeNS(null, 'visibility', 'visible')

    console.log(orb)

    return orb
  }

  /**
   * Return the specified orb.
   *
   * @param {Orb} orb
   */
  return(orb) {
    orb.setAttributeNS(null, 'visibility', 'hidden')
    this.buffer.push(orb)
  }
}

module.exports = OrbPool