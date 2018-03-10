/**
 * @module common/collision-detector
 */

const merge = require('lodash/merge')
const forIn = require('lodash/forIn')

const { Vector, V } = require('../../common/vector')

/**
 * @class
 */
class CollisionDetector {
  /**
   * Create a new collision detector.
   *
   * @param {?Vector} worldSize - The size of the world. If left undefined,
   *  collisions with walls will not be detected.
   */
  constructor(worldSize = null) {
    this.boxes = Object.create(null)
    this.worldSize = worldSize
    this.collisions = []
  }

  /**
   * Set the specified box.
   *
   * @param {number} id - The ID of the box.
   * @param {object} box - The box.
   */
  set(id, box) {
    if (!this.boxes[id]) {
      this.boxes[id] = {}
    }

    merge(this.boxes[id], box)
  }

  /**
   * Remove the specified box.
   *
   * @param {number} id - The ID of the box.
   */
  remove(id) {
    delete this.boxes[id]
  }

  /**
   * Detect collisions.
   * @todo Now it uses a simple naive loop, but in the future
   * if it does not suffice, move to an advanced algorithm like
   * AABB or spacial partitioning collision detection.
   */
  detect() {
    this.collisions = []

    const ids = Object.keys(this.boxes)

    for (let i = 0; i < ids.length; i++) {
      const id1 = ids[i],
            box1 = this.boxes[id1]

      /** Collisions with other boxes. */
      for (let j = 0; j < i; j++) {
        const id2 = ids[j],
              box2 = this.boxes[id2]

        if (box1.minP.x < box2.maxP.x && box1.maxP.x > box2.minP.x &&
            box1.minP.y < box2.maxP.y && box2.maxP.y > box2.minP.y) {
          this.collisions.push({
            type: 'object',
            id1,
            id2
          })
        }
      }

      /** Collisions with walls */
      if (this.worldSize) {
        if (box1.minP.x < 0) {
          this.collisions.push({
            type: 'wall',
            wall: 'left',
            id: id1
          })
        } else if (box1.maxP.x >= this.worldSize.x) {
          this.collisions.push({
            type: 'wall',
            wall: 'right',
            id: id1
          })
        }

        if (box1.minP.y < 0) {
          this.collisions.push({
            type: 'wall',
            wall: 'top',
            id: id1
          })
        } else if (box1.maxP.y >= this.worldSize.y) {
          this.collisions.push({
            type: 'wall',
            wall: 'bottom',
            id: id1
          })
        }
      }
    }
  }

  /**
   * Return all entitites intersecting with the specified box.
   *
   * @param {object} box
   * @param {Vector} box.minP
   * @param {Vector} box.maxP
   * @return {array}
   */
  queryBox({ minP, maxP }) {
    const result = []

    forIn(this.boxes, (box, id) => {
      if (box.minP.x < maxP.x && box.maxP.x > minP.x &&
          box.minP.y < maxP.y && box.maxP.y > minP.y) {

          result.push(id)
      }
    })

    return result
  }
}

module.exports = CollisionDetector