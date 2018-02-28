const ServerSpeedUp = require('../../../server/game/effects/speedup')

let ClientEffectFactory
const ClientSpeedUp = require('../../../client/game/effects/speedup').default

const { SPEEDUP } = require('../../../common/effects')

beforeEach(() => {
  jest.resetModules()

  ClientEffectFactory = require('../../../client/game/effect-factory').default
  ClientEffectFactory.register({
    type: SPEEDUP,
    constructor: ClientSpeedUp
  })
})

describe('SpeedUp effect serialization', () => {
  test('deserialized effect should match the original one', () => {
    const serverEffect = new ServerSpeedUp(42),
          serverLength = serverEffect.serializedLength(),
          buffer = Buffer.alloc(serverLength)

    serverEffect.serialize(buffer)

    const {
      effect: clientEffect,
      offset: clientLength
    } = ClientEffectFactory.deserialize(buffer)

    expect(serverLength).toBe(clientLength)
    expect(clientEffect).toBeInstanceOf(ClientSpeedUp)
    expect(clientEffect.value).toBe(42)
  } )
})