const Effect = require('../effect')
const { stamp, compose2 } = require('../../../common/stamp')
const { SPEEDUP } = require('../../../common/effects')

const SpeedUp = compose2(Effect, stamp({
  init(value) {
    this._parent.init.call(this)
    this.value = value
  },

  proto:  {
    onReceive(target) {
      target.moveForce += this.value
    },

    onRemove(target) {
      target.moveForce -= this.value
    },

    serialize(buffer, offset = 0) {
      this._parent.proto.serialize.call(this, buffer, offset)
      offset += this._parent.proto.serializedLength.call(this)

      buffer.writeUInt8(SPEEDUP, offset)
      offset += 1

      buffer.writeDoubleBE(this.value, offset)
      offset += 8

      return this
    },

    serializedLength() {
      return this._parent.proto.serializedLength.call(this) + 9
    }
  }
}))

module.exports = SpeedUp