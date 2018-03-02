const ServerWorld = require('../../server/game/world')
const ServerOrb = require('../../server/game/entities/orb')
const ServerSpeedUp = require('../../server/game/effects/speedup')
const ServerInstantDamage = require('../../server/game/effects/instant-damage')

let ClientEntityFactory
let ClientEffectFactory
let ClientWorld

const { Vector, V } = require('../../common/vector')
const entities = require('../../common/entities')
const effects = require('../../common/effects')

beforeEach(() => {
  jest.resetModules()

  ClientEntityFactory = require('../../client/game/entity-factory').default
  ClientEffectFactory = require('../../client/game/effect-factory').default
  ClientWorld = require('../../client/game/world').default

  ClientEntityFactory.register({
    type: entities.ORB,
    constructor: require('../../client/game/entities/orb').default
  })

  ClientEffectFactory.register({
    type: effects.SPEEDUP,
    constructor: require('../../client/game/effects/speedup').default
  })

  ClientEffectFactory.register({
    type: effects.INSTANT_DAMAGE,
    constructor: require('../../client/game/effects/instant-damage').default
  })
})

describe('World serialization', () => {
  test('deserialized world should match the original one', () => {
    const serverWorld   =  new ServerWorld({
            size: V(801, 602)
          }),
          serverOrb1    = new ServerOrb({
            maxHp: 100,
            hp:    62,
            maxMp: 150,
            mp:    30
          }),
          serverOrb2    = new ServerOrb({
            maxHp: 120,
            hp:    30,
            maxMp: 1000,
            mp:    745
          }),
          serverEffect1 = new ServerSpeedUp({
            value: 0.1
          }),
          serverEffect2 = new ServerInstantDamage({
            value: 50
          }),
          serverEffect3 = new ServerSpeedUp({
            value: -0.05
          })

    serverOrb1.receiveEffect(serverEffect1)
    serverOrb1.receiveEffect(serverEffect2)
    serverOrb2.receiveEffect(serverEffect3)

    const id1 = serverWorld.new(serverOrb1),
          id2 = serverWorld.new(serverOrb2)

    const buffer = serverWorld.toBuffer()

    ClientWorld.init({
      svg:  document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
      info: document.createElement('div')
    })
    ClientWorld.parse(buffer)

    expect(ClientWorld.size.x).toBeCloseTo(801)
    expect(ClientWorld.size.y).toBeCloseTo(602)
    expect(Object.keys(ClientEntityFactory.entities)).toHaveLength(2)
  })
})