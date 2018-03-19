import { ORBS } from '@common/const'

import Red   from '@client/game/orbs/red'
import Gold  from '@client/game/orbs/gold'
import Green from '@client/game/orbs/green'

export default (factory) => {
  Array.of(
    [ ORBS.RED,   Red   ],
    [ ORBS.GOLD,  Gold  ],
    [ ORBS.GREEN, Green ]
  ).forEach(([ type, constructor ]) => {
    factory.register({ type, constructor })
  })
}