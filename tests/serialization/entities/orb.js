import ClientOrb from '@client/game/entities/orb'
const ServerOrb = require('@server/game/entities/orb')
const { ORB } = require('@common/entities')

describe('Orb entity serialization', () => {
  const entityAPI = {
    createSkill: jest.fn(),
    createEffect: jest.fn()
  }

  beforeEach(() => {
    entityAPI.createSkill.mockClear()
    entityAPI.createEffect.mockClear()
  })

  test('deserialized orb should match the original one', () => {
    const serverOrb = new ServerOrb({
      radius: 50,
      maxHp: 100,
      hp: 80,
      maxMp: 105,
      mp: 30
    }, entityAPI)

    const serverLength = serverOrb.binaryLength,
          buffer = Buffer.alloc(serverLength)

    serverOrb.serialize(buffer)

    const clientOrb = new ClientOrb(42),
          clientLength = clientOrb.parse(buffer)

    expect(serverLength).toBe(clientLength)
    expect(clientOrb.radius).toBe(50)
    expect(clientOrb.maxHp).toBe(100)
    expect(clientOrb.hp).toBe(80)
    expect(clientOrb.maxMp).toBe(105)
    expect(clientOrb.mp).toBe(30)
  })
})