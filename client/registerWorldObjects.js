import EntityFactory from './game/entity-factory'
import EffectFactory from './game/effect-factory'
import * as entities from '../common/entities'
import * as effects from '../common/effects'

import Orb from './game/entities/orb'

import SpeedUp from './game/effects/speedup'
import SlowDown from './game/effects/slowdown'
import InstantDamage from './game/effects/instant-damage'

EntityFactory.register({
  type: entities.ORB,
  constructor: Orb
})

EffectFactory.register({
  type: effects.SPEEDUP,
  constructor: SpeedUp
})

EffectFactory.register({
  type: effects.SLOWDOWN,
  constructor: SlowDown
})

EffectFactory.register({
  type: effects.INSTANT_DAMAGE,
  constructor: InstantDamage
})