const Effect = require('../effect')
const { stamp, compose2 } = require('../../../common/stamp')
const { INSTANT_DAMAGE } = require('../../../common/effects')

const InstantDamage = compose2(Effect, stamp({
  init(value) {
    this._parent.init.call(this)
    this.value = value
  },

  proto: {
    onReceive(target) {
      target.hp -= this.value

      this.die()
    },

    serialize(buffer, offset = 0) {
      this._parent.proto.serialize.call(this, buffer, offset)
      offset += this._parent.proto.serializedLength.call(this)

      buffer.writeUInt8(INSTANT_DAMAGE, offset)
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

module.exports = InstantDamage