/**
 * @module common/collision-detector
 */

const merge = require('lodash/merge')

const { Vector, V } = require('./vector')

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
   * @param {string} id - The ID of the box.
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
   * @param {string} id - The ID of the box.
   */
  remove(id) {
    delete this.boxes[id]
  }

  /**
   * Detect collisions.
   * @todo Now it uses a simple naive loop, but in the future
   * if it does not suffice, move to an advanced algorithm like
   * AABB collision detection.
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

        if (box1.p1.x < box2.p2.x && box1.p2.x > box2.p1.x &&
            box1.p1.y < box2.p2.y && box2.p2.y > box2.p1.y) {
          this.collisions.push({
            type: 'object',
            id1,
            id2
          })
        }
      }

      /** Collisions with walls */
      if (this.worldSize) {
        if (box1.p1.x < 0) {
          this.collisions.push({
            type: 'wall',
            wall: 'left',
            id: id1
          })
        } else if (box1.p2.x >= this.worldSize.x) {
          this.collisions.push({
            type: 'wall',
            wall: 'right',
            id: id1
          })
        }

        if (box1.p1.y < 0) {
          this.collisions.push({
            type: 'wall',
            wall: 'top',
            id: id1
          })
        } else if (box1.p2.y >= this.worldSize.y) {
          this.collisions.push({
            type: 'wall',
            wall: 'bottom',
            id: id1
          })
        }
      }
    }
  }
}

module.exports = CollisionDetector