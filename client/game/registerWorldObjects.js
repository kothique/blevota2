import EntityFactory from '@client/game/entity-factory'
import EffectFactory from '@client/game/effect-factory'
import * as entities from '@common/entities'
import * as effects  from '@common/effects'

import Orb from '@client/game/entities/orb'

import SpeedUp       from '@client/game/effects/speedup'
import SlowDown      from '@client/game/effects/slowdown'
import InstantDamage from '@client/game/effects/instant-damage'
import Magnetism     from '@client/game/effects/magnetism'
import HiddenStrike  from '@client/game/effects/hidden-strike'

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

EffectFactory.register({
  type: effects.MAGNETISM,
  constructor: Magnetism
})

EffectFactory.register({
  type: effects.HIDDEN_STRIKE,
  constructor: HiddenStrike
})