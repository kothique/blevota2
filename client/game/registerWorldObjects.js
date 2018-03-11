import EntityFactory from '@client/game/entity-factory'
import * as entities from '@common/entities'

import Orb from '@client/game/entities/orb'

EntityFactory.register({
  type: entities.ORB,
  constructor: Orb
})