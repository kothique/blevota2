/**
 * @module common/state
 */

const Orb = require('./orb')

/**
 * @class
 */
class State {
  constructor() {
    this.orbs = {}
  }

  /**
   * Create a new buffer containing the state.
   *
   * @return {Buffer} - The state information.
   */
  toBuffer() {
    const ids = Object.keys(this.orbs)

    const buffer = Buffer.allocUnsafe(8 + ids.length * (Orb.binaryLength + 24))
    buffer.writeDoubleBE(ids.length, 0)

    let offset = 8
    for (const id in this.orbs) {
      buffer.write(id, offset, 24)
      this.orbs[id].writeToBuffer(buffer, offset + 24)

      offset += Orb.binaryLength + 24
    }

    return buffer
  }

  /**
   * Read the state from a buffer.
   *
   * @param {Buffer} buffer - The buffer to read the state from.
   * @return {State}
   */
  static fromBuffer(buffer) {
    const count = buffer.readDoubleBE(0)

    const state = new State
    for (let i = 0; i < count; i++) {
      const offset = 8 + i * (24 + Orb.binaryLength)

      const id = buffer.toString('utf8', offset, offset + 24)
      state.orbs[id] = Orb.fromBuffer(buffer, offset + 24)
    }

    return state
  }
}

module.exports = State