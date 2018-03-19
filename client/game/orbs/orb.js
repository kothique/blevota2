/**
 * @module client/game/orbs/orb
 */

import { Vector, V } from '@common/vector'

/** @class */
class Orb {
  constructor(id, options = {}) {
    this.id = id

    this.position = V(0, 0)
    this.previous = {
      position: V(0, 0)
    }

    this.reserved = false
    this.rendered = false

    this.radius  = 0
    this.maxHp   = 0
    this.hp      = 0
    this.visible = true

    this.nodes = {}

    this.nodes.outer = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    this.nodes.outer.setAttributeNS(null, 'fill', 'grey')
    this.nodes.outer.setAttributeNS(null, 'cx',   0)
    this.nodes.outer.setAttributeNS(null, 'cy',   0)
    this.nodes.outer.setAttributeNS(null, 'r',    0)

    this.nodes.middle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    this.nodes.middle.setAttributeNS(null, 'fill', 'rgb(0, 218, 255)')
    this.nodes.middle.setAttributeNS(null, 'cx',   0)
    this.nodes.middle.setAttributeNS(null, 'cy',   0)
    this.nodes.middle.setAttributeNS(null, 'r',    0)

    this.nodes.inner = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    this.nodes.inner.setAttributeNS(null, 'fill', 'rgb(0, 0, 0)')
    this.nodes.inner.setAttributeNS(null, 'fill-opacity', 0.3)
    this.nodes.inner.setAttributeNS(null, 'cx',   0)
    this.nodes.inner.setAttributeNS(null, 'cy',   0)
    this.nodes.inner.setAttributeNS(null, 'r',    0)

    this.node = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    this.node.appendChild(this.nodes.outer)
    this.node.appendChild(this.nodes.middle)
    this.node.appendChild(this.nodes.inner)
  }

  parse(buffer, offset = 0) {
    this.changed = true

    this.previous.position = this.position.clone()

    this.position = V(buffer.readDoubleBE(offset), buffer.readDoubleBE(offset + 8))
    offset += 16

    this.radius = buffer.readDoubleBE(offset)
    offset += 8

    this.maxHP = buffer.readDoubleBE(offset)
    offset += 8

    this.hp = buffer.readDoubleBE(offset)
    offset += 8

    this.visible = buffer.readUInt8(offset++)

    return offset
  }

  render(viewport = V(0, 0)) {
    if (this.rendered) {
      return
    }
    this.rendered = true

    const hpValue  = this.maxHP ? this.hp / this.maxHP : 0,
          position = Vector.subtract(this.position, viewport)

    this.nodes.outer.setAttributeNS(null, 'r', this.radius)
    this.nodes.middle.setAttributeNS(null, 'r', 0.9 * this.radius)
    this.nodes.inner.setAttributeNS(null, 'r', 0.6 * this.radius)

    this.nodes.outer.setAttributeNS(null, 'fill-opacity', hpValue / 2)

    this.node.setAttributeNS(null, 'transform', `translate(${position.x} ${position.y})`)
  }

  reserve() {
    this.reserved = true
    this.node.setAttributeNS(null, 'visibility', 'hidden')
  }

  return() {
    this.reserved = false
    this.node.setAttributeNS(null, 'visibility', 'visible')
  }

  extrapolate(timestamp) {
    const { prev, curr, next } = timestmap

    /** @todo */
  }
}

export default Orb