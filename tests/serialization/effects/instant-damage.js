const ServerInstantDamage = require('../../../server/game/effects/instant-damage')
const { default: ClientEffect } = require('../../../client/game/effect')
require('../../../client/game/effects/instant-damage')
const { INSTANT_DAMAGE } = require('../../../common/effects')

describe('SpeedUp effect serialization', () => {
  test('deserialized effect should match the serialized one', () => {
    const serverEffect = ServerInstantDamage.create(42),
          serverLength = serverEffect.serializedLength(),
          buffer = Buffer.alloc(serverLength)

    serverEffect.serialize(buffer)

    const {
      effect: clientEffect,
      offset: clientLength
    } = ClientEffect.deserialize(buffer)

    expect(serverLength).toBe(clientLength)
    expect(clientEffect.type).toBe(INSTANT_DAMAGE)
    expect(clientEffect.value).toBe(42)
  } )
})