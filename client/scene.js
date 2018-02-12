import SPool from './scene/s-pool'

export default class Scene {
  /**
   * Create a new scene.
   *
   * @param {Node} svg - The SVG element to render the scene on.
   */
  constructor(svg) {
    this.svg = svg
    this.pool = new SPool(this.svg)
    this.orbs = Object.create(null)
  }

  /**
   * Add a new orb to the scene.
   * 
   * @param {string} id - The new orb's ID.
   */
  newOrb(id) {
    const orb = this.pool.getOrb()

    this.svg.appendChild(orb.getNode())
    this.orbs[id] = orb
  }

  /**
   * Update the specified orb.
   *
   * @param {string} id - The orb's ID.
   * @param {object} info
   */
  updateOrb(id, info) {
    if (this.orbs[id]) {
      this.orbs[id].render(info)
    }    
  }

  /**
   * Remove the orb from the scene.
   *
   * @param {string} id - The orb's ID.
   */
  removeOrb(id) {
    if (this.orbs[id]) {
      this.svg.removeChild(this.orbs[id].getNode())
      delete this.orbs[id]
    }
  }

  /**
   * Retrieve the orb from the scene.
   *
   * @param {string} id - The orb's ID.
   */
  getOrb(id) {
    return this.orbs[id]
  }
}