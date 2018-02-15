/**
 * @module common/orb
 */

const Entity = require('./entity')

/**
 * @class
 */
class Orb extends Entity {
  /**
   * Create a new orb.
   *
   * @param {object} options - Options.
   * The options are as follows:
   *  radius: number,
   *  maxHp:  number,
   *  hp:     number,
   *  maxMp:  number,
   *  mp:     number
   */
  constructor(options) {
    super({
      ...options,
      mass:      options.mass      || 1,
      moveForce: options.moveForce || 0.1
    })

    this.maxHp = options.maxHp
    this.hp = options.hp
    this.maxMp = options.maxMp
    this.mp = options.mp
  }

  /**
   * Write the orb's binary representation into a buffer.
   *
   * @param {Buffer} buffer - The buffer to write to.
   * @param {number} offset
   */
  writeToBuffer(buffer, offset) {
    super.writeToBuffer(buffer, offset)
    offset += Entity.binaryLength

    buffer.writeDoubleBE(this.maxHp, offset + 8 * 0)
    buffer.writeDoubleBE(this.hp,    offset + 8 * 1)
    buffer.writeDoubleBE(this.maxMp, offset + 8 * 2)
    buffer.writeDoubleBE(this.mp,    offset + 8 * 3)
  }

  /**
   * Create an orb from a buffer.
   * 
   * @param {Buffer} buffer - The buffer to create the orb from.
   * @param {number} offset - Offset in bytes.
   * @return {Orb} - The resulting orb.
   */
  static fromBuffer(buffer, offset) {
    const entity = Entity.fromBuffer(buffer, offset)
    offset += Entity.binaryLength

    let orb = new Orb({
            radius: entity.radius,
            maxHp:  buffer.readDoubleBE(offset + 8 * 0),
            hp:     buffer.readDoubleBE(offset + 8 * 1),
            maxMp:  buffer.readDoubleBE(offset + 8 * 2),
            mp:     buffer.readDoubleBE(offset + 8 * 3)
          })
    Object.assign(orb, entity)

    return orb
  }
}

/**
 * @type {number}
 * @static
 */
Orb.binaryLength = Entity.binaryLength + 8 * 4

module.exports = Orb