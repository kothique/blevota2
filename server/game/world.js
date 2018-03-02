/**
 * @module server/game/world
 */

const forIn = require('lodash/forIn')
const EventEmitter = require('events')

const { V, Vector } = require('../../common/vector')
const { ORB } = require('../../common/entities')
const CollisionDetector = require('./collision-detector')
const InstantDamage = require('./effects/instant-damage')
const Entity = require('./entities/entity')
const Orb = require('./entities/orb')

/**
 * @class
 *
 * @event death - entity
 *
 * @description
 * Manage all entities in the world and their interaction
 * including collision detection, using skills, etc.
 */
class World extends EventEmitter {
  /**
   * Create a new world.
   *
   * @param {object} options
   * @param {Vector} options.size - The size of the world.
   */
  constructor(options) {
    super()

    this.size = options.size
    this.entities = Object.create(null)
    this.detector = new CollisionDetector(this.size)

    this.nextID = 0
  }

  /**
   * Add a new entity to the world.
   *
   * @param {Entity} entity
   * @return {number} - ID of the new entity.
   */
  new(entity) {
    const id = this.nextID++
    this.entities[id] = entity

    return id
  }

  /**
   * Remove the entity with the specified ID from the world.
   *
   * @param {number} id
   * @chainable
   */
  remove(id) {
    this.detector.remove(id)
    delete this.entities[id]

    return this
  }

  /**
   * Clear forces of all entities.
   * 
   * @chainable
   */
  clearForces() {
    forIn(this.entities, (entity) => {
      entity.force = V(0, 0)
    })

    return this
  }

  /**
   * Apply controls.
   *
   * @param {object} controls
   * @chainable
   */
  applyControls(controls) {
    forIn(controls, (controls, id) => {
      const entity = this.entities[id]

      if (entity) {
        entity.applyControls(controls)
      }
    })

    return this
  }

  /**
   * Advance the physics of the world by dt.
   *
   * @param {number} t  - Current timestamp.
   * @param {number} dt - Timestep in seconds.
   * @chainable
   */
  integrate(t, dt) {
    forIn(this.entities, (entity, id) => {
      entity.integrate(t, dt) 

      if (entity instanceof Orb) {
        const position = entity.position,
              radius   = entity.radius

        this.detector.set(id, {
          p1: Vector.subtract(position, V(radius, radius)),
          p2: Vector.add(position, V(radius, radius))
        })
      }
    })

    return this
  }

  /**
   * Apply effects of all entities.
   *
   * @param {number} t  - Current timestamp.
   * @param {number} dt - Timestep in seconds.
   * @chainable
   */
  applyEffects(t, dt) {
    forIn(this.entities, (entity, id) => {
      entity.applyEffects(t, dt)

      if (entity instanceof Orb && entity.alive === false) {
        this.emit('death', id)
      }
    })

    return this
  }

  /**
   * Handle collisions.
   *
   * @chainable
   */
  handleCollisions() {
    const k = 0.8

    this.detector.detect()
    this.detector.collisions.forEach((collision) => {
      if (collision.type === 'wall') {
        const { wall, id } = collision

        const entity = this.entities[id]

        if (entity instanceof Orb) {
          const orb = entity

          orb.receiveEffect(new InstantDamage({ value: 5 }))

          switch (wall) {
            case 'left':
              orb.velocity.x *= -k
              orb.position.x = orb.radius
              break
            case 'right':
              orb.velocity.x *= -k
              orb.position.x = this.size.x - orb.radius
              break
            case 'top':
              orb.velocity.y *= -k
              orb.position.y = orb.radius
              break
            case 'bottom':
              orb.velocity.y *= -k
              orb.position.y = this.size.y - orb.radius
              break
          }
        }
      } else if (collision.type === 'object') {
        const { id1, id2 } = collision

        const entity1 = this.entities[id1],
              entity2 = this.entities[id2]

        if (entity1 instanceof Orb && entity2 instanceof Orb) {
          let orb1 = entity1,
              orb2 = entity2

          const dr = orb1.radius + orb2.radius - Vector.distance(orb1.position, orb2.position)

          /** If only bounding boxes collide, not the orbs themselves. */
          if (dr < 0) {
            return
          }

          orb1.receiveEffect(new InstantDamage({ value: orb2.mass * 10 }))
          orb2.receiveEffect(new InstantDamage({ value: orb1.mass * 10 }))

          const v1 = orb1.velocity,
                v2 = orb2.velocity,
                m1 = orb1.mass,
                m2 = orb2.mass

          const o1v = Vector.add(v1.clone().multiply(m1 - m2), v2.clone().multiply(2 * m2)).divide(m1 + m2),
                o2v = Vector.add(v2.clone().multiply(m2 - m1), v1.clone().multiply(2 * m1)).divide(m1 + m2)

          orb1.velocity = o1v
          orb2.velocity = o2v

          orb1.position.add(orb1.velocity)
          orb2.position.add(orb2.velocity)
        }
      }
    })

    return this
  }

  /**
   * Write the world to a buffer.
   *
   * @param {Buffer} buffer
   * @param {number} offset
   */
  serialize(buffer, offset = 0) {
    buffer.writeUInt16BE(this.size.x, offset)
    offset += 2

    buffer.writeUInt16BE(this.size.y, offset)
    offset += 2

    buffer.writeUInt16BE(Object.keys(this.entities).length, offset)
    offset += 2

    forIn(this.entities, (entity, id) => {
      buffer.writeUInt16BE(id, offset)
      offset += 2

      buffer.writeUInt8(entity.constructor.getType(), offset)
      offset += 1

      entity.serialize(buffer, offset)
      offset += entity.serializedLength()
    })
  }

  /**
   * The size of the world serialized.
   *
   * @return {number}
   */
  serializedLength() {
    let entitiesLength = 0
    forIn(this.entities, (entity) => {
      entitiesLength += 2 + 1 + entity.serializedLength()
    })

    return 2 + 2 + 2 + entitiesLength
  }

  /**
   * Create a buffer containing the world.
   *
   * @return {Buffer}
   */
  toBuffer() {
    const buffer = Buffer.allocUnsafe(this.serializedLength())
    this.serialize(buffer)

    return buffer
  }
}

module.exports = World