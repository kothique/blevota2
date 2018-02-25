const ServerSpeedUp = require('../../../server/game/effects/speedup')
const { default: ClientEffect } = require('../../../client/game/effect')
require('../../../client/game/effects/speedup')
const { SPEEDUP } = require('../../../common/effects')

describe('SpeedUp effect serialization', () => {
  test('deserialized effect should match the original one', () => {
    const serverEffect = ServerSpeedUp.create(42),
          serverLength = serverEffect.serializedLength(),
          buffer = Buffer.alloc(serverLength)

    serverEffect.serialize(buffer)

    const {
      effect: clientEffect,
      offset: clientLength
    } = ClientEffect.deserialize(buffer)

    expect(serverLength).toBe(clientLength)
    expect(clientEffect.type).toBe(SPEEDUP)
    expect(clientEffect.value).toBe(42)
  } )
})