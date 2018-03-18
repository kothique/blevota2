import { ORBS } from '@common/const'

import Orb from '@client/game/orbs/orb'

export default (factory) => {
  factory.register({
    type: ORBS.UNKNOWN,
    constructor: Orb
  })
}