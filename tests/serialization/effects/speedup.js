const ServerSpeedUp = require('@server/game/effects/speedup')

let ClientEffectFactory
import ClientSpeedUp from '@client/game/effects/speedup'

const { SPEEDUP } = require('@common/effects')

beforeEach(() => {
  jest.resetModules()

  ClientEffectFactory = require('@client/game/effect-factory').default
  ClientEffectFactory.register({
    type: SPEEDUP,
    constructor: ClientSpeedUp
  })
})

describe('SpeedUp effect serialization', () => {
  test('deserialized effect should match the original one', () => {
    const serverEffect = new ServerSpeedUp({ value: 42 }),
          serverLength = serverEffect.binaryLength,
          buffer = Buffer.alloc(serverLength)

    serverEffect.serialize(buffer)

    const {
      effect: clientEffect,
      offset: clientLength
    } = ClientEffectFactory.deserialize(buffer)

    expect(serverLength).toBe(clientLength)
    expect(clientEffect).toBeInstanceOf(ClientSpeedUp)
    expect(clientEffect.value).toBeCloseTo(42)
  } )
})