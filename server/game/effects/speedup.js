const Effect = require('../effect')
const { stamp, compose2 } = require('../../../common/stamp')
const { SPEEDUP } = require('../../../common/effects')

const SpeedUp = compose2(Effect, stamp({
  init(value) {
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
      this._parentProto.serialize.call(this, buffer, offset)
      offset += this._parentProto.serializedLength.call(this)

      buffer.writeUInt8(SPEEDUP, offset)
      offset += 1

      buffer.writeDoubleBE(this.value, offset)
      offset += 8

      return this
    },

    serializedLength() {
      return this._parentProto.serializedLength.call(this) + 9
    }
  }
}))

module.exports = SpeedUp