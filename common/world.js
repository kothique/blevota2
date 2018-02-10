/**
 * @module common/world
 */

const set = require('lodash/set')
const get = require('lodash/get')
const merge = require('lodash/merge')

const Orb = require('./orb')
const State = require('./state')
const CollisionDetector = require('./collision-detector')
const { Vector, v } = require('./vector')

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
    this.diff = {}
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
    const orb = new Orb
    this.state.orbs[id] = orb

    this.collisionDetector.add(id, {
      p1: v(-30, -30),
      p2: v(30, 30)
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

    for (const id in orbs)
      orbs[id].force = v(0, 0)

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
   * Apply forces according to collisions.
   *
   * @todo
   * @chainable
  */
  applyCollisionResponse() {
    const k = 0.8

    this.collisions.forEach((collision) => {
      if (collision.type === 'wall') {
        const { wall, id } = collision

        const orb = this.state.orbs[id] 
        merge(orb, get(this.diff, `orbs.${id}`))

        switch (wall) {
          case 'left':
            set(this.diff, `orbs.${id}.velocity.x`, -k * orb.velocity.x)
            set(this.diff, `orbs.${id}.position.x`, 30)
            break
          case 'right':
            set(this.diff, `orbs.${id}.velocity.x`, -k * orb.velocity.x)
            set(this.diff, `orbs.${id}.position.x`, this.worldSize.x - 30)
            break
          case 'top':
            set(this.diff, `orbs.${id}.velocity.y`, -k * orb.velocity.y)
            set(this.diff, `orbs.${id}.position.y`, 30)
            break
          case 'bottom':
            set(this.diff, `orbs.${id}.velocity.y`, -k * orb.velocity.y)
            set(this.diff, `orbs.${id}.position.y`, this.worldSize.y - 30)
            break
        }
      } else if (collision.type === 'object') {
        const { id1, id2 } = collision

        const orb1 = this.state.orbs[id1],
              orb2 = this.state.orbs[id2]
        merge(orb1, get(this.diff, `orbs.${id1}`))
        merge(orb2, get(this.diff, `orbs.${id2}`))

        const dr = 30 + 30 - Vector.distance(orb1.position, orb2.position)

        /** If only bounding boxes collide, not the orbs themselves. */
        if (dr < 0) {
          return
        }

        /** Move the orbs so that they only overlap in one point. */
        const m = orb1.mass + orb2.mass,
              dr1 = orb1.mass / m * dr,
              dr2 = orb2.mass / m * dr,
              p = Vector.subtract(orb2.position, orb1.position).normalize(),
              p1 = Vector.multiply(p, -dr1),
              p2 = Vector.multiply(p, dr2)

        set(this.diff, `orbs.${id1}.position`, Vector.add(orb1.position, p1))
        set(this.diff, `orbs.${id2}.position`, Vector.add(orb2.position, p2))

        /** Mutate velocity so that the orbs bounce off each other. */
        const l = new Vector(-p.y, p.x),
              v1 = orb1.velocity,
              k1 = 2 * Vector.dot(v1, l) / Vector.dot(l, l),
              newV1 = Vector.multiply(l, k1).subtract(v1),
              v2 = orb2.velocity,
              k2 = 2 * Vector.dot(v2, l) / Vector.dot(l ,l),
              newV2 = Vector.multiply(l, k2).subtract(v2)

        const v = newV1.length() + newV2.length()

        newV1.setLength(v / 2 * k)
        newV2.setLength(v / 2 * k)
        
        set(this.diff, `orbs.${id1}.velocity`, newV1)
        set(this.diff, `orbs.${id2}.velocity`, newV2)
      }
    })

    return this
  }

  /**
   * Advance the physics by dt.
   * 
   * @param {number} t  - Current timestamp.
   * @param {number} dt - Time delta.
   * @chainable
   */
  integrate(t, dt) {
    const { orbs } = this.state

    for (const id in orbs) {
      const orbDiff = orbs[id].integrate(t, dt)

      if (orbDiff) {
        set(this.diff, `orbs.${id}`, orbDiff)

        if (orbDiff.position) {
          const { x, y } = orbDiff.position

          this.collisionDetector.set(id, {
            p1: v(x - 30, y - 30),
            p2: v(x + 30, y + 30)
          })
        }
      }
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
   * Merge `this.diff` into `this.state` to prepare for the next iteration.
   *
   * @chainable
   */
  finishIteration() {
    merge(this.state, this.diff)
    this.diff = {}

    return this
  }
}

module.exports = World