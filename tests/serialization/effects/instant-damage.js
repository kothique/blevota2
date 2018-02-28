const ServerInstantDamage = require('../../../server/game/effects/instant-damage')

let ClientEffectFactory
const ClientInstantDamage = require('../../../client/game/effects/instant-damage').default

const { INSTANT_DAMAGE } = require('../../../common/effects')

beforeEach(() => {
  jest.resetModules()

  ClientEffectFactory = require('../../../client/game/effect-factory').default
  ClientEffectFactory.register({
    type: INSTANT_DAMAGE,
    constructor: ClientInstantDamage
  })
})

describe('SpeedUp effect serialization', () => {
  test('deserialized effect should match the serialized one', () => {
    const serverEffect = new ServerInstantDamage({ value: 42 }),
          serverLength = serverEffect.serializedLength(),
          buffer = Buffer.alloc(serverLength)

    serverEffect.serialize(buffer)

    const {
      effect: clientEffect,
      offset: clientLength
    } = ClientEffectFactory.deserialize(buffer)

    expect(serverLength).toBe(clientLength)
    expect(clientEffect).toBeInstanceOf(ClientInstantDamage)
    expect(clientEffect.value).toBe(42)
  } )
})