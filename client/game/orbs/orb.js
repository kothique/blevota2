/**
 * @module client/game/orbs/orb
 */

import { List } from 'immutable'

import { Vector, V } from '@common/vector'
import { COOLDOWN }  from '@common/skill-state'

/** @class */
class Orb {
  constructor(id, options) {
    this.id = id
    this.api = options.orbAPI

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

    this.skills = []

    this.nodes = {}

    this.nodes.outer = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    this.nodes.outer.setAttributeNS(null, 'fill', 'grey')
    this.nodes.outer.setAttributeNS(null, 'cx',   0)
    this.nodes.outer.setAttributeNS(null, 'cy',   0)
    this.nodes.outer.setAttributeNS(null, 'r',    0)

    this.nodes.middle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    this.nodes.middle.setAttributeNS(null, 'fill',   this.color)
    this.nodes.middle.setAttributeNS(null, 'cx',     0)
    this.nodes.middle.setAttributeNS(null, 'cy',     0)
    this.nodes.middle.setAttributeNS(null, 'r',      0)

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
    this.rendered = false

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

    this.skills.forEach(skill => offset = skill.parse(buffer, offset))

    return offset
  }

  parseSkillsForSkillBox(buffer, offset = 0) {
    return { offset, skills: List() }
  }

  /** @return {bool} - Whether the orb was rendered. */
  render(viewport, t, dt) {
    if (this.rendered) {
      return false
    }
    this.rendered = true

    this.nodes.outer.setAttributeNS(null, 'r', this.radius)
    this.nodes.middle.setAttributeNS(null, 'r', 0.9 * this.radius)
    this.nodes.inner.setAttributeNS(null, 'r', 0.6 * this.radius)

    if (!this.visible) {
      this.nodes.inner.setAttributeNS(null, 'visibility', 'hidden')
      this.nodes.middle.setAttributeNS(null, 'fill-opacity', 0.3)
    } else {
      this.nodes.inner.setAttributeNS(null, 'visibility', 'visible')
      this.nodes.middle.setAttributeNS(null, 'fill-opacity', 1)
    }

    const hpValue  = this.maxHP ? this.hp / this.maxHP : 0,
          position = Vector.subtract(this.position, viewport)

    this.nodes.outer.setAttributeNS(null, 'fill-opacity', hpValue / 2)
    this.node.setAttributeNS(null, 'transform', `translate(${position.x} ${position.y})`)

    this.skills.forEach(skill => skill.render(viewport, t, dt))

    return true
  }

  reserve() {
    if (!this.reserved) {
      this.reserved = true
      this.node.setAttributeNS(null, 'visibility', 'hidden')
    }
  }

  return() {
    if (this.reserved) {
      this.reserved = false
      this.node.setAttributeNS(null, 'visibility', 'visible')
    }
  }

  extrapolate(timestamp) {
    const { prev, curr, next } = timestmap

    /** @todo */
  }

  static parseSkill = (buffer, offset = 0) => {
    const skill = {
      type: buffer.readUInt8(offset)
    }
    offset += 1

    if (skill.type === COOLDOWN) {
      skill.value = buffer.readUInt16BE(offset)
      offset += 2
    }

    return { skill, offset }
  }
}

export default Orb