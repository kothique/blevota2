/**
 * @module client/game/skills/hidden-strike
 */

import Skill from './skill'

import { Vector, V } from '@common/vector'
import Pool          from '@common/pool'

/** @class */
class HiddenStrike extends Skill {
  constructor(options) {
    super(options)

    this.targets = []
    this.nodes.lines = []
    this.linePool = new Pool({
      create: () => {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
        line.setAttributeNS(null, 'stroke', 'white')
        line.setAttributeNS(null, 'stroke-width', 2)
        line.setAttributeNS(null, 'x1', 0)
        line.setAttributeNS(null, 'y1', 0)
        line.setAttributeNS(null, 'visibility', 'hidden')

        this.node.appendChild(line, this.nodes.outer)

        return line
      },
      onReturn: line => line.setAttributeNS(null, 'visibility', 'hidden'),
      onGet:    line => line.setAttributeNS(null, 'visibility', 'visible'),
      initial:  5,
      step:     2
    })

    this.nodes.hiddenStrike = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    this.nodes.hiddenStrike.setAttributeNS(null, 'fill', 'none')
    this.nodes.hiddenStrike.setAttributeNS(null, 'stroke', 'white')
    this.nodes.hiddenStrike.setAttributeNS(null, 'stroke-opacity', 0.3)
    this.nodes.hiddenStrike.setAttributeNS(null, 'stroke-dasharray', '5 5')
    this.nodes.hiddenStrike.setAttributeNS(null, 'visibility', 'hidden')
    this.node.insertBefore(this.nodes.hiddenStrike, this.nodes.outer)
  }

  /** @override */
  startAnimation(viewport, t) {
    this.nodes.hiddenStrike.setAttributeNS(null, 'visibility', 'visible')
  }

  /** @override */
  animate(viewport, t, dt) {
    this.nodes.lines = this.linePool.get(this.targets.length)

    const orbs = this.api.getOrbs()

    for (let i = 0; i < this.nodes.lines.length; i++) {
      const line = this.nodes.lines[i],
            orb  = orbs[this.targets[i]],
            pos  = Vector.subtract(orb.position, viewport).subtract(Vector.subtract(this.owner.position, viewport))

      line.setAttributeNS(null, 'x2', pos.x)
      line.setAttributeNS(null, 'y2', pos.y)
    }
  }

  /** @override */
  endAnimation(viewport, t) {
    this.nodes.hiddenStrike.setAttributeNS(null, 'visibility', 'hidden')
    this.linePool.returnAll()
  }

  /** @override */
  parse(buffer, offset = 0) {
    offset = super.parse(buffer, offset)

    this.nodes.hiddenStrike.setAttributeNS(null, 'r', buffer.readUInt16BE(offset))
    offset += 2

    this.targets = []

    const targetsCount = buffer.readUInt8(offset++)
    for (let i = 0; i < targetsCount; i++) {
      this.targets.push(buffer.readUInt16BE(offset))
      offset += 2
    }

    return offset
  }
}

export default HiddenStrike