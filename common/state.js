/**
 * @module common/state
 */

const Entity = require('./entity')

/**
 * @class
 */
class State {
  constructor() {
    this.orbs = {}
  }
}

/**
 * Create a new buffer containing the state.
 *
 * @return {Buffer} - The state information.
 */
State.prototype.toBuffer = function () {
  const ids = Object.keys(this.orbs)

  const buffer = Buffer.allocUnsafe(8 + ids.length * (Entity.binaryLength + 24))
  buffer.writeDoubleBE(ids.length, 0)

  let offset = 8
  for (const id of ids) {
    buffer.write(id, offset, 24)
    this.orbs[id].writeToBuffer(buffer, offset + 24)

    offset += Entity.binaryLength + 24
  }

  return buffer
}

/**
 * Read the state from a buffer.
 *
 * @param {Buffer} buffer - The buffer to read the state from.
 * @return {State}
 */
State.fromBuffer = function (buffer) {
  const count = buffer.readDoubleBE(0)

  const state = new State
  for (let i = 0; i < count; i++) {
    const offset = 8 + i * (24 + Entity.binaryLength)

    const id = buffer.toString('utf8', offset, offset + 24)
    state.orbs[id] = Entity.fromBuffer(buffer, offset + 24)
  }

  return state
}

module.exports = State