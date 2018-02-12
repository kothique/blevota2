/**
 * @module client/scene/s-pool
 */

import SOrb from './s-orb'

/**
 * @class
 */
export default class SPool {
  /**
   * Create a new pool.
   *
   * @param {Node} svg - The svg element to put the orbs in.
   * @param {?number} preallocate - Number of orbs to pre-allocate.
   */
  constructor(svg, preallocate = 10) {
    this.svg = svg
    this.orbBuffer = []

    this.allocate(preallocate)
  }

  /**
   * Allocate a number of orbs.
   *
   * @param {?number} n - Number of orbs to allocate.
   */
  allocate(n = 1) {
    for (let i = 0; i < n; i++) {
      const orb = new SOrb().setVisibility('hidden')
      
      this.orbBuffer.push(orb)
      this.svg.appendChild(orb.element)
    }
  }

  /**
   * Get an orb.
   *
   * @return {SOrb}
   */
  getOrb() {
    if (!this.orbBuffer.length) {
      this.allocate(5)
    }

    return this.orbBuffer.shift().setVisibility('visible')
  }

  /**
   * Return the specified orb.
   *
   * @param {Orb} orb
   */
  returnOrb(orb) {
    this.orbBuffer.push(orb.setVisibility('hidden'))
  }

  /**
   * Amount of objects in the pool.
   */
  length() {
    return this.orbBuffer.length
  }
}