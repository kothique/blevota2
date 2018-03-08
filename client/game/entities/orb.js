/**
 * @module client/game/entities/orb
 */

import Entity from './entity'
import Set from 'collections/set'
import { Vector, V } from '@common/vector'
import { ORB } from '@common/entities'
import { SVG } from '@common/util'

/**
 * @class
 */
class Orb extends Entity {
  /**
   * Create a new orb.
   *
   * @param {number} id
   * @param {?object} options
   * @param {?bool}   options.isPlayer
   */
  constructor(id, options = Object.create(null)) {
    super(id, { type: ORB })

    const isPlayer = options.isPlayer || false    

    this.radius = 0
    this.maxHp = 0
    this.hp = 0
    this.maxMp = 0
    this.mp = 0

    this.toRender = true

    this.nodes = Object.create(null)

    this.nodes.circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    this.nodes.circle.setAttributeNS(null, 'fill', isPlayer ? 'rgb(0, 255, 212)' : 'rgb(0, 101, 255)')
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
  }

  /**
   * Read orb info except from id and type from a buffer.
   *
   * @param {Buffer} buffer
   * @param {number} offset
   * @return {number} - New offset.
   */
  parse(buffer, offset = 0) {
    offset = super.parse(buffer, offset)

    this.toRender = true

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
  }

  /**
   * Set attributes of the SVG nodes.
   *
   * @param {Vector} viewport
   */
  render(viewport = V(0, 0)) {
    if (!this.toRender) {
      return
    }
    this.toRender = false

    const hpValue  = this.maxHp ? this.hp / this.maxHp : 0,
          mpValue  = this.maxMp ? this.mp / this.maxMp : 0,
          position = Vector.subtract(this.position, viewport)

    this.nodes.circle.setAttributeNS(null, 'r', this.radius)
    this.nodes.mp    .setAttributeNS(null, 'r', 0.8 * this.radius)
    this.nodes.hp    .setAttributeNS(null, 'r', 0.5 * this.radius)

    this.nodes.mp    .setAttributeNS(null, 'fill-opacity', mpValue)
    this.nodes.hp    .setAttributeNS(null, 'fill-opacity', hpValue)

    this.node        .setAttributeNS(null, 'transform', `translate(${position.x} ${position.y})`)
  }

  /**
   * Hide the orb from the screen.
   *
   * @override
   */
  hide() {
    super.hide()

    this.node.setAttributeNS(null, 'visibility', 'hidden')
  }

  /**
   * Show the orb on the screen.
   *
   * @override
   */
  show() {
    super.show()

    this.node.setAttributeNS(null, 'visibility', 'visible')
  }
}

export default Orb