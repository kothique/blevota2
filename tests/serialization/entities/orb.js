const ServerOrb = require('../../../server/game/entities/orb')

let ClientEntityFactory
const ClientOrb = require('../../../client/game/entities/orb').default

const { ORB } = require('../../../common/entities')

beforeEach(() => {
  jest.resetModules()

  ClientEntityFactory = require('../../../client/game/entity-factory').default
  ClientEntityFactory.register({
    type: ORB,
    constructor: ClientOrb
  })
})

describe('Orb entity serialization', () => {
  test('deserialized orb should match the original one', () => {
    const serverOrb = new ServerOrb('a'.repeat(24), {
      radius: 50,
      maxHp: 100,
      hp: 80,
      maxMp: 105,
      mp: 30
    })

    const serverLength = serverOrb.serializedLength(),
          buffer = Buffer.alloc(serverLength)

    serverOrb.serialize(buffer)

    const {
      entity: clientOrb,
      offset: clientLength
    } = ClientEntityFactory.deserialize(buffer)

    expect(serverLength).toBe(clientLength)
    expect(clientOrb).toBeInstanceOf(ClientOrb)
    expect(clientOrb.radius).toBe(50)
    expect(clientOrb.maxHp).toBe(100)
    expect(clientOrb.hp).toBe(80)
    expect(clientOrb.maxMp).toBe(105)
    expect(clientOrb.mp).toBe(30)
  })
})