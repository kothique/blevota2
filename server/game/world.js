/**
 * @module server/game/world
 */

const forIn = require('lodash/forIn')
const EventEmitter = require('events')

const CollisionDetector = require('./collision-detector')
const Orb               = require('./orbs/orb')

const { V, Vector }     = require('../../common/vector')

/**
 * @class
 *
 * @event death - orb
 *
 * @description
 * Manage all orbs in the world and their interaction
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

    this.size     = options.size
    this.orbs     = {}
    this.detector = new CollisionDetector(this.size)

    this.nextID = 0

    this.orbAPI = {
      createSkill: this.createSkill.bind(this),
      createEffect: this.createEffect.bind(this)
    }

    this.skillAPI = this.effectAPI = {
      createEffect: this.createEffect.bind(this),
      getOrb: (id) => this.orbs[id],

      queryBox: this.detector.queryBox.bind(this.detector),
      querySquare: ({ centerP, side }) => this.detector.queryBox({
        minP: Vector.subtract(centerP, V(side, side).divide(2)),
        maxP: Vector     .add(centerP, V(side, side).divide(2))
      }),

      getOrbsInCircle: ({ centerP, radius }) => this.skillAPI.querySquare({
        centerP, side: radius * 2
      })
      .map(id => this.orbs[id])
      .filter(orb => Vector.distance(orb.position, centerP) - orb.radius <= radius)
    }
  }

  /**
   * Add a new orb to the world.
   *
   * @param {Orb} orb
   * @return {number} - ID of the new orb.
   */
  new(orb) {
    const id = this.nextID++
    this.orbs[id] = orb
    orb.id = id

    return id
  }

  /**
   * Remove the orb with the specified ID from the world.
   *
   * @param {number} id
   * @chainable
   */
  remove(id) {
    this.detector.remove(id)
    delete this.orbs[id]

    return this
  }

  /**
   * Clear forces of all orbs.
   * 
   * @chainable
   */
  clearForces() {
    forIn(this.orbs, (orb) => { orb.force = V(0, 0) })

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
      const orb = this.orbs[id]

      if (orb) {
        orb.applyControls(controls)
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
    forIn(this.orbs, (orb, id) => {
      orb.integrate(t, dt)

      const position = orb.position,
            radius   = orb.radius

      this.detector.set(id, {
        minP: Vector.subtract(position, V(radius, radius)),
        maxP: Vector     .add(position, V(radius, radius))
      })
    })

    return this
  }

  /**
   * Apply effects of all orbs.
   *
   * @param {number} t  - Current timestamp.
   * @param {number} dt - Timestep in seconds.
   * @chainable
   */
  applyEffects(t, dt) {
    forIn(this.orbs, (orb, id) => {
      orb.applyEffects(t, dt)

      if (!orb.alive) {
        this.emit('orb:death', id)
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

        const orb = this.orbs[id]

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
      } else if (collision.type === 'object') {
        const { id1, id2 } = collision

        const orb1 = this.orbs[id1],
              orb2 = this.orbs[id2]

        const dr = orb1.radius + orb2.radius - Vector.distance(orb1.position, orb2.position)

        /** If only bounding boxes collide, not the orbs themselves. */
        if (dr < 0) {
          return
        }

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
    /** Write world size. */
    buffer.writeUInt16BE(this.size.x, offset)
    offset += 2

    buffer.writeUInt16BE(this.size.y, offset)
    offset += 2

    /** Write viewport. */
    buffer.writeUInt16BE(0, offset)
    offset += 2

    buffer.writeUInt16BE(0, offset)
    offset += 2

    /** Write number of orbs. */
    buffer.writeUInt16BE(Object.keys(this.orbs).length, offset)
    offset += 2

    /** Write orbs. */
    forIn(this.orbs, (orb, id) => {
      /** Write orb id. */
      buffer.writeUInt16BE(id, offset)
      offset += 2

      /** Write orb type. */
      buffer.writeUInt8(orb.type, offset)
      offset += 1

      /** Write orb state. */
      orb.serialize(buffer, offset)
      offset += orb.binaryLength
    })
  }

  /**
   * The size of the world serialized.
   *
   * @return {number}
   */
  get binaryLength() {
    let orbsLength = 0
    forIn(this.orbs, (orb) => {
      orbsLength += 2 + 1 + orb.binaryLength
    })

    return 2 + 2 + 2 + 2 + 2 + orbsLength
  }

  /**
   * Create a buffer containing the world.
   *
   * @return {Buffer}
   */
  toBuffer() {
    const buffer = Buffer.allocUnsafe(this.binaryLength)
    this.serialize(buffer)

    return buffer
  }

  /**
   * Serialize only a limited box area of the world.
   *
   * @param {object} box
   * @param {Vector} box.minP
   * @param {Vector} box.maxP
   * @param {Orb}    box.for
   * @return {Buffer}
   */
  boxToBuffer(box) {
    const orbs = this.detector.queryBox(box)
      .map((id) => {
        const orb = this.orbs[id]

        return { id, orb, length: orb.binaryLength }
      })
      .filter(({ orb }) => orb.visible || orb === box.for)

    const orbsLength = orbs.reduce((acc, { length }) => acc + 2 + 1 + length, 0),
          buffer     = Buffer.allocUnsafe(5 * 2 + orbsLength)

    let offset = 0
    /* Write world size. */
    buffer.writeUInt16BE(this.size.x, offset)
    offset += 2

    buffer.writeUInt16BE(this.size.y, offset)
    offset += 2

    /* Write viewport position. */
    buffer.writeInt16BE(box.minP.x, offset)
    offset += 2

    buffer.writeInt16BE(box.minP.y, offset)
    offset += 2

    /* Write number of orbs. */
    buffer.writeUInt16BE(orbs.length, offset)
    offset += 2

    /* Write orbs. */
    orbs.forEach(({ id, orb, length }) => {
      /* Write orb id. */
      buffer.writeUInt16BE(id, offset)
      offset += 2

      /* Write orb type. */
      buffer.writeUInt8(orb.type, offset)
      offset += 1

      /* Write orb state. */
      orb.serialize(buffer, offset)
      offset += length
    })

    return buffer
  }

  /**
   * Create a new orb provided with World.orbAPI.
   *
   * @param {function} constructor
   * @param {?object}  options - Object to pass to the orb's constructor.
   */
  createOrb(constructor, options = {}) {
    return new constructor(options, this.orbAPI)
  }

  /**
   * Create a new skill provided with World.skillAPI.
   *
   * @param {function} constructor
   * @param {?object}  options - Object to pass to the skill's constructor.
   */
  createSkill(constructor, options = {}) {
    return new constructor(options, this.skillAPI)
  }

  /**
   * Create a new effect provided with World.effectAPI.
   *
   * @param {function} constructor
   * @param {?object}  options - Object to pass to the effect's constructor.
   */
  createEffect(constructor, options = {}) {
    return new constructor(options, this.effectAPI)
  }
}

module.exports = World