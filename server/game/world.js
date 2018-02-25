const forIn = require('lodash/forIn')

const { stamp } = require('../../common/stamp')
const { V, Vector } = require('../../common/vector')
const { ORB } = require('../../common/entities')
const CollisionDetector = require('../../common/collision-detector')
const InstantDamage = require('./effects/instant-damage')
const Entity = require('./entity')

/**
 * @class
 *
 * @description
 * Manage all entities in the world and their interaction
 * including collision detection, using skills, etc.
 */
const World = stamp({
  /**
   * Initialize the new world.
   *
   * @param {Vector} size - The size of the world.
   */
  init(size) {
    this.size = size
    this.entities = Object.create(null)
  },

  /**
   * Define private properties and methods they are used by.
   */
  enclose() {
    const detector = new CollisionDetector(this.size)
    let collisions = []

    /**
     * Clear forces of all entities.
      */
    this.clearForces = function clearForces() {
      forIn(this.entities, (entity) => {
        entity.force = V(0, 0)
      })
    }

    /**
     * Apply controls.
     *
     * @param {object} controls
     */
    this.applyControls = function applyControls(controls) {
      forIn(controls, (controls, id) => {
        const entity = this.entities[id]

        if (entity) {
          entity.applyControls(controls)
        }
      })
    }

    /**
     * Advance the physics of the world by dt.
     *
     * @param {number} t  - Current timestamp.
     * @param {number} dt - Timestep in seconds.
     */
    this.integrate = function integrate(t, dt) {
      forIn(this.entities, (entity) => {
        entity.integrate(t, dt)

        if (entity.type === ORB) {
          const position = entity.position,
                radius   = entity.radius

          detector.set(entity.id, {
            p1: Vector.subtract(position, V(radius, radius)),
            p2: Vector.add(position, V(radius, radius))
          })
        }
      })
    }

    /**
     * Apply effects of all entities.
     *
     * @param {number} t  - Current timestamp.
     * @param {number} dt - Timestep in seconds.
     */
    this.applyEffects = function applyEffects(t, dt) {
      forIn(this.entities, (entity) => {
        entity.applyEffects(t, dt)
      })
    }

    /**
     * Detect collisions.
     */
    this.detectCollisions = function detectCollisions() {
      collisions = detector.detect()
    }

    /**
     * Apply forces according to collisions.
     */
    this.applyCollisionResponse = function applyCollisionResponse() {
      const k = 0.8

      collisions.forEach((collision) => {
        if (collision.type === 'wall') {
          const { wall, id } = collision

          const entity = this.entities[id]

          if (entity.type === ORB) {
            const orb = entity

            orb.receive(InstantDamage.create(5))

            switch (wall) {
              case 'left':
                orb.velocity.x *= -k
                orb.position.x = orb.radius
                break
              case 'right':
                orb.velocity.x *= -k
                orb.position.x = this.worldSize.x - orb.radius
                break
              case 'top':
                orb.velocity.y *= -k
                orb.position.y = orb.radius
                break
              case 'bottom':
                orb.velocity.y *= -k
                orb.position.y = this.worldSize.y - orb.radius
                break
            }
          }
        } else if (collision.type === 'object') {
          const { id1, id2 } = collision

          const entity1 = this.entities[id1],
                entity2 = this.entities[id2]

          if (entity1.type === ORB && entity2.type === ORB) {
            orb1.receive(new InstantDamage(orb2.mass * 10))
            orb2.receive(new InstantDamage(orb1.mass * 10))

            const dr = orb1.radius + orb2.radius - Vector.distance(orb1.position, orb2.position)

            /** If only bounding boxes collide, not the orbs themselves. */
            if (dr < 0) {
              return
            }

            /** Move the orbs so that they only overlap in one point. */
            const r = orb1.radius + orb2.radius,
                  dr1 = orb2.radius / r * dr,
                  dr2 = orb1.radius / r * dr,
                  p = Vector.subtract(orb2.position, orb1.position).normalize(),
                  p1 = Vector.multiply(p, -dr1),
                  p2 = Vector.multiply(p, dr2)

            orb1.position.add(p1)
            orb2.position.add(p2)

            /** Mutate velocity so that the orbs bounce off each other. */
            const l = new Vector(-p.y, p.x),
                  v1 = orb1.velocity,
                  k1 = 2 * Vector.dot(v1, l) / Vector.dot(l, l),
                  newV1 = Vector.multiply(l, k1).subtract(v1),
                  v2 = orb2.velocity,
                  k2 = 2 * Vector.dot(v2, l) / Vector.dot(l ,l),
                  newV2 = Vector.multiply(l, k2).subtract(v2)

            const v = newV1.length() + newV2.length(),
                  m = orb1.mass + orb2.mass

            newV1.setLength(v * orb2.mass / m * k)
            newV2.setLength(v * orb1.mass / m * k)

            orb1.velocity = newV1
            orb2.velocity = newV2
          }
        }
      })
    }
  },

  proto: {
    /**
     * Add a new entity to the world.
     *
     * @param {string} id
     * @param {Entity} entity
     * @chainable
     */
    new(entity) {
      this.entities[entity.id] = entity

      return this
    },

    /**
     * Remove the entity with the specified ID from the world.
     *
     * @param {string} id
     * @chainable
     */
    remove(id) {
      delete this.entities[id]

      return this
    },

    /**
     * Write the world to a buffer.
     *
     * @param {Buffer} buffer
     * @param {number} offset
     */
    serialize(buffer, offset = 0) {
      buffer.writeInt16BE(this.size.x, offset)
      offset += 2

      buffer.writeInt16BE(this.size.y, offset)
      offset += 2

      buffer.writeInt16BE(Object.keys(this.entities).length, offset)
      offset += 2

      forIn(this.entities, (entity) => {
        entity.serialize(buffer, offset)
        offset += entity.serializedLength()
      })
    },

    /**
     * The size of the world serialized.
     *
     * @return {number}
     */
    serializedLength() {
      let entitiesLength = 0
      forIn(this.entities, (entity) => {
        entitiesLength += entity.serializedLength()
      })

      return 2 + 2 + 2 + entitiesLength
    },

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
})

module.exports = World