const ServerOrb = require('../../../server/game/entities/orb')
const { default: ClientEntity } = require('../../../client/game/entity')
require('../../../client/game/entities/orb')
const { ORB } = require('../../../common/entities')

describe('Orb entity serialization', () => {
  test('deserialized orb should match the original one', () => {
    const serverOrb = ServerOrb.create('a'.repeat(24), {
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
    } = ClientEntity.deserialize(buffer)

    expect(serverLength).toBe(clientLength)
    expect(clientOrb.type).toBe(ORB)
    expect(clientOrb.radius).toBe(50)
    expect(clientOrb.maxHp).toBe(100)
    expect(clientOrb.hp).toBe(80)
    expect(clientOrb.maxMp).toBe(105)
    expect(clientOrb.mp).toBe(30)
  })
})