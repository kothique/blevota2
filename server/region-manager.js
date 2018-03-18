/**
 * @module server/region-factory
 */

const Region = require('./region')

const createRegion = (name) => {
  const region = RegionManager.regions[name] = new Region(name)
  region.run()
}

/**
 * @class
 *
 * @description
 * Manage region creation, deletion, etc.
 */
const RegionManager = {
  /**
   * Get region with the specified name.
   *
   * @param {string} name
   * @return {Region|undefined}
   */
  get(name) {
    return this.regions[name]
  },

  regions: Object.create(null)
}

/** Two default regions. */
createRegion('Wonderland')
createRegion('Cedade de Deus')

module.exports = RegionManager