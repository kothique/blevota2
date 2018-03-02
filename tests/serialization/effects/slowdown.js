const ServerSlowDown = require('../../../server/game/effects/slowdown')

let ClientEffectFactory
const ClientSlowDown = require('../../../client/game/effects/slowdown').default

const { SLOWDOWN } = require('../../../common/effects')

beforeEach(() => {
  jest.resetModules()

  ClientEffectFactory = require('../../../client/game/effect-factory').default
  ClientEffectFactory.register({
    type: SLOWDOWN,
    constructor: ClientSlowDown
  })
})

describe('SlowDown effect serialization', () => {
  test('deserialized effect should match the original one', () => {
    const serverEffect = new ServerSlowDown(42),
          serverLength = serverEffect.serializedLength(),
          buffer = Buffer.alloc(serverLength)

    serverEffect.serialize(buffer)

    const {
      effect: clientEffect,
      offset: clientLength
    } = ClientEffectFactory.deserialize(buffer)

    expect(serverLength).toBe(clientLength)
    expect(clientEffect).toBeInstanceOf(ClientSlowDown)
    expect(clientEffect.value).toBe(42)
  } )
})