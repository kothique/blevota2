const ServerWorld = require('../../server/game/world')
const ServerOrb = require('../../server/game/entities/orb')
const ServerSpeedUp = require('../../server/game/effects/speedup')
const ServerInstantDamage = require('../../server/game/effects/instant-damage')

require('../../client/game/entities/orb')
require('../../client/game/effects/instant-damage')
require('../../client/game/effects/speedup')
const { default: ClientWorld } = require('../../client/game/world')
const { default: Entity } = require('../../client/game/entity')

const { Vector, V } = require('../../common/vector')

beforeEach(() => {
  jest.resetModules()
})

describe('World serialization', () => {
  test('deserialized world should match the original one', () => {
    const serverWorld   = ServerWorld.create(V(801, 602)),
          id1           = 'a'.repeat(24),
          id2           = 'b'.repeat(24),
          serverOrb1    = ServerOrb.create(id1, {
            maxHp: 100,
            hp:    80,
            maxMp: 150,
            mp:    30
          }),
          serverOrb2    = ServerOrb.create(id2, {
            maxHp: 120,
            hp:    30,
            maxMp: 1000,
            mp:    745
          }),
          serverEffect1 = ServerSpeedUp.create({
            value: 0.1
          }),
          serverEffect2 = ServerInstantDamage.create({
            value: 50
          }),
          serverEffect3 = ServerSpeedUp.create({
            value: -0.05
          })

    serverOrb1.receiveEffect(serverEffect1)
    serverOrb1.receiveEffect(serverEffect2)
    serverOrb2.receiveEffect(serverEffect3)

    serverWorld.new(serverOrb1)
    serverWorld.new(serverOrb2)

    const buffer = serverWorld.toBuffer()

    ClientWorld.init({
      svg:  document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
      info: document.createElement('div')
    })
    ClientWorld.parse(buffer)

    expect(ClientWorld.size.x).toBeCloseTo(801)
    expect(ClientWorld.size.y).toBeCloseTo(602)
    expect(Object.keys(Entity.entities)).toHaveLength(2)
  })
})