const ServerMagnetism = require('@server/game/effects/magnetism')

let ClientEffectFactory
import ClientMagnetism from '@client/game/effects/magnetism'

const { MAGNETISM } = require('@common/effects')

beforeEach(() => {
  jest.resetModules()

  ClientEffectFactory = require('@client/game/effect-factory').default
  ClientEffectFactory.register({
    type: MAGNETISM,
    constructor: ClientMagnetism
  })
})

describe('Magnetism effect serialization', () => {
  test('deserialized effect should match the original one', () => {
    const serverEffect = new ServerMagnetism({
      minValue: 42,
      maxValue: 64,
      radius:   60
    })

    const serverLength = serverEffect.binaryLength,
          buffer = Buffer.alloc(serverLength)

    serverEffect.serialize(buffer)

    const {
      effect: clientEffect,
      offset: clientLength
    } = ClientEffectFactory.deserialize(buffer)

    expect(serverLength).toBe(clientLength)
    expect(clientEffect).toBeInstanceOf(ClientMagnetism)
    expect(clientEffect.minValue).toBeCloseTo(42)
    expect(clientEffect.maxValue).toBeCloseTo(64)
    expect(clientEffect.radius).toBeCloseTo(60)
  } )
})