import * as entities from '@common/entities'

import Orb from '@client/game/entities/orb'

export default (factory) => {
  factory.register({
    type: entities.ORB,
    constructor: Orb
  })
}