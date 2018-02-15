/**
 * @module common/world
 */

const set = require('lodash/set')
const get = require('lodash/get')
const merge = require('lodash/merge')

const Orb = require('./orb')
const State = require('./state')
const InstantDamage = require('./effects/instant-damage')
const CollisionDetector = require('./collision-detector') 
const { Vector, V } = require('./vector')

/**
 * @class
 */
class World {
  /**
   * Create a new world.
   *
   * @param {?Vector} worldSize - The size of the world. If left undefined,
   *   collisions with walls will not be detected.
   * @param {?State} initialState - Initial state.
   */
  constructor(worldSize = null, initialState = new State) {
    this.worldSize = worldSize
    this.state = initialState
    this.collisions = []
    this.collisionDetector = new CollisionDetector(this.worldSize)
  }

  /**
   * Add a new orb into the world.
   *
   * @param {string} id - The ID of the new orb.
   * @chainable
   */
  newOrb(id) {
    const radius = 30 + Math.random() * 100,
          mass = 1 + Math.random(),
          x = 100 + Math.random() * 200,
          y = 100 + Math.random() * 20

    const orb = new Orb({
      mass,
      radius,
      position: V(x, y),
      maxHp: 100,
      hp: 80,
      maxMp: 100,
      mp: 70
    })

    this.state.orbs[id] = orb
    this.collisionDetector.add(id, {
      p1: Vector.subtract(orb.position, V(radius, radius)),
      p2: Vector.add(orb.position, V(radius, radius))
    })

    return this
  }

  /**
   * Delete the specified orb.
   *
   * @param {string} id - The ID of the orb.
   * @chainable
   */
  removeOrb(id) {
    delete this.state.orbs[id]
    this.collisionDetector.remove(id)

    return this
  }

  /**
   * Clear forces of all orbs in the world.
   *
   * @chainable
   */
  startIteration() {
    const { orbs } = this.state

    for (const id in orbs) {
      orbs[id].force = V(0, 0)
    }

    return this
  }

  /**
   * Set forces according to controls.
   *
   * @param {number} id - The user's ID.
   * @param {object} controls - The user's controls.
   * @chainable
   */
  applyControls(id, controls) {
    const { orbs } = this.state,
          orb = orbs[id]
    
    if (orb) {
      orb.applyControls(controls)
    }

    return this
  }

  /**
   * Advance the physics by `dt`.
   * 
   * @param {number} t  - Current timestamp in seconds.
   * @param {number} dt - Timestep in seconds.
   * @chainable
   */
  integrate(t, dt) {
    const { orbs } = this.state

    for (const id in orbs) {
      orbs[id].integrate(t, dt)
      orbs[id].applyEffects(dt)

      const position = orbs[id].position,
            radius = orbs[id].radius

      this.collisionDetector.set(id, {
        p1: Vector.subtract(position, V(radius, radius)),
        p2: Vector.add(position, V(radius, radius))
      })
    }

    return this
  }

  /**
   * Detect collisions according to `this.diff`.
   *
   * @chainable
   */
  detectCollisions() {
    this.collisions = this.collisionDetector.detect()

    return this
  }

  /**
   * Apply forces according to collisions.
   *
   * @chainable
  */
  applyCollisionResponse() {
    const k = 0.8

    this.collisions.forEach((collision) => {
      if (collision.type === 'wall') {
        const { wall, id } = collision

        const orb = this.state.orbs[id] 

        orb.receive(new InstantDamage(5))

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
      } else if (collision.type === 'object') {
        const { id1, id2 } = collision

        const orb1 = this.state.orbs[id1],
              orb2 = this.state.orbs[id2]

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
    })

    return this
  }

  /**
   * Does nothing.
   *
   * @chainable
   */
  finishIteration() {
    return this
  }
}

module.exports = World