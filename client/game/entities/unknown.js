/**
 * @module client/game/entitites/unknown
 */

import Entity from './entity'

/**
 * @class
 */
class Unknown extends Entity {
  /**
   * Create a new unknonwn entity.
   *
   * @param {string} id
   * @param {number} type
   */
  constructor(id, type) {
    super(id)

    this.type = type
  }

  /**
   * @throws {Error}
   */
  parse() {
    throw new Error('.../entities/Unknown.prototype.parse is not intended to be called.')
  }
}

export default Unknown