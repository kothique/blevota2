/**
 * @module client/game/entities/orb
 */

import Entity from '../entity'
import Effect from '../effect'
import Set from 'collections/set'
import { Vector, V } from '../../../common/vector'
import * as entities from '../../../common/entities'
import { SVG } from '../../../common/util'

Entity.register({
  type: entities.ORB,

  /**
   * Initialize the new orb.
   */
  init() {
    this.mass = 0
    this.moveForce = 0
    this.position = V(0, 0)
    this.effects = new Set
    this.radius = 0
    this.maxHp = 0
    this.hp = 0
    this.maxMp = 0
    this.mp = 0

    this.toRender = true

    this.previous = {
      position: V(0, 0)
    }

    this.nodes = {}

    this.nodes.circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    this.nodes.circle.setAttributeNS(null, 'fill', 'rgb(0, 101, 255)')
    this.nodes.circle.setAttributeNS(null, 'cx', 0)
    this.nodes.circle.setAttributeNS(null, 'cy', 0)
    this.nodes.circle.setAttributeNS(null, 'r',  0)

    this.nodes.mp = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    this.nodes.mp.setAttributeNS(null, 'fill', 'rgb(0, 218, 255)')
    this.nodes.mp.setAttributeNS(null, 'cx', 0)
    this.nodes.mp.setAttributeNS(null, 'cy', 0)
    this.nodes.mp.setAttributeNS(null, 'r',  0)

    this.nodes.hp = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    this.nodes.hp.setAttributeNS(null, 'fill', 'rgb(243, 101, 255)')
    this.nodes.hp.setAttributeNS(null, 'cx', 0)
    this.nodes.hp.setAttributeNS(null, 'cy', 0)
    this.nodes.hp.setAttributeNS(null, 'r',  0)
    
    this.node = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    this.node.appendChild(this.nodes.circle)
    this.node.appendChild(this.nodes.mp)
    this.node.appendChild(this.nodes.hp)
  },

  parse(buffer, offset = 0) {
    this.toRender = true

    this.mass = buffer.readDoubleBE(offset)
    offset += 8

    this.moveForce = buffer.readDoubleBE(offset)
    offset += 8

    this.previous.position = this.position.clone()

    this.position = V(
      buffer.readDoubleBE(offset),
      buffer.readDoubleBE(offset + 8),
    )
    offset += 16

    this.effects.clear()

    const effectsCount = buffer.readUInt8(offset)
    offset += 1

    for (let i = 0; i < effectsCount; i++) {
      const result = Effect.deserialize(buffer, offset)

      offset = result.offset
      this.effects.add(result.effect)
    }

    this.radius = buffer.readDoubleBE(offset)
    offset += 8

    this.maxHp = buffer.readDoubleBE(offset)
    offset += 8

    this.hp = buffer.readDoubleBE(offset)
    offset += 8

    this.maxMp = buffer.readDoubleBE(offset)
    offset += 8

    this.mp = buffer.readDoubleBE(offset)
    offset += 8

    return offset
  },

  extrapolate(timestamp) {
    const { prev, curr, next } = timestamp

    this.position.add(
      Vector.subtract(this.position, this.previous.position)
        .divide(curr - prev)
        .multiply(next - curr)
    )
  },

  render() {
    if (!this.toRender) {
      return
    }
    this.toRender = false

    const hpValue = this.hp / this.maxHp,
          mpValue = this.mp / this.maxMp

    this.nodes.circle.setAttributeNS(null, 'r', this.radius)
    this.nodes.mp    .setAttributeNS(null, 'r', 0.8 * this.radius)
    this.nodes.hp    .setAttributeNS(null, 'r', 0.5 * this.radius)

    this.nodes.mp    .setAttributeNS(null, 'fill-opacity', mpValue)
    this.nodes.hp    .setAttributeNS(null, 'fill-opacity', hpValue)

    this.node        .setAttributeNS(null, 'transform', `translate(${this.position.x} ${this.position.y})`)
  }
})