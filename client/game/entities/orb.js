/**
 * @module client/game/entities/orb
 */

import Entity from '../entity'
import Effect from '../effect'
import Set from 'collections/set'
import { Vector, V } from '../../../common/vector'
import * as entities from '../../../common/entities'

Entity.register({
  type: entities.ORB,

  init() {
    this.radius = 0
    this.mass = 0
    this.moveForce = 0
    this.position = V(0, 0)
    this.effects = new Set
    this.maxHp = 0
    this.hp = 0
    this.maxMp = 0
    this.mp = 0

    this.toRender = true

    this.previous = {
      position: V(0, 0)
    }

    this.circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    this.circle.setAttributeNS(null, 'fill', 'rgb(50, 150, 80)')
    this.circle.setAttributeNS(null, 'fill-opacity', '0.7')
    this.circle.setAttributeNS(null, 'stroke', 'black')
    this.circle.setAttributeNS(null, 'stroke-width', '3px')
    this.circle.setAttributeNS(null, 'cx', 0)
    this.circle.setAttributeNS(null, 'cy', 0)
    this.circle.setAttributeNS(null, 'r',  0)

    this.hp = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    this.hp.setAttributeNS(null, 'fill', 'red')
    this.hp.setAttributeNS(null, 'fill-opacity', '0.7')
    this.hp.setAttributeNS(null, 'stroke', 'black')
    this.hp.setAttributeNS(null, 'stroke-width', '0')
    this.hp.setAttributeNS(null, 'transform', 'rotate(30)')

    this.mp = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    this.mp.setAttributeNS(null, 'fill', 'blue')
    this.mp.setAttributeNS(null, 'fill-opacity', '0.7')
    this.mp.setAttributeNS(null, 'stroke', 'black')
    this.mp.setAttributeNS(null, 'stroke-width', '0')
    this.mp.setAttributeNS(null, 'transform', 'rotate(210)')
    
    this.group = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    this.group.appendChild(this.circle)
    this.group.appendChild(this.hp)
    this.group.appendChild(this.mp)
  },

  parse(buffer, offset) {
    this.toRender = true

    this.radius = buffer.readDoubleBE(offset)
    offset += 8

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

    this.circle.setAttributeNS(null, 'r', radius)
    this.hp.setAttributeNS(null, 'd', SVG.circleBar(V(0, 0), radius * 0.8, radius, hpValue))
    this.mp.setAttributeNS(null, 'd', SVG.circleBar(V(0, 0), radius * 0.6, radius * 0.8, mpValue))
    this.group.setAttributeNS(null, 'transform', `translate(${position.x} ${position.y})`)
  }
})