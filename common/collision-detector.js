/**
 * @module common/collision-detector
 */

const merge = require('lodash/merge')

const { Vector, v } = require('./vector')

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
    this.boxes = {}
    this.worldSize = worldSize
  }

  /**
   * Add a new box to the detector.
   *
   * @param {string} id - The ID of the box.
   * @param {object} box - The box.
   */
  add(id, box) {
    this.boxes[id] = box
  }

  /**
   * Change the specified box.
   *
   * @param {string} id - The ID of the box.
   * @param {object} box - The box.
   */
  set(id, box) {
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
   *
   * @return {array} - Detected collisions.
   */
  detect() {
    let collisions = []

    const ids = Object.keys(this.boxes)

    for (let i = 0; i < ids.length; i++) {
      if (ids[i] in this.boxes) {
        const id1 = ids[i],
              box1 = this.boxes[id1]

        /** Collisions with other boxes. */
        for (let j = 0; j < i; j++) {
          const id2 = ids[j],
                box2 = this.boxes[id2]

          if (box1.p1.x < box2.p2.x && box1.p2.x > box2.p1.x &&
              box1.p1.y < box2.p2.y && box2.p2.y > box2.p1.y) {
            collisions.push({
              type: 'object',
              id1,
              id2
            })
          }
        }

        /** Collisions with walls */
        if (this.worldSize) {
          if (box1.p1.x < 0) {
            collisions.push({
              type: 'wall',
              wall: 'left',
              id: id1
            })
          } else if (box1.p2.x >= this.worldSize.x) {
            collisions.push({
              type: 'wall',
              wall: 'right',
              id: id1
            })
          }

          if (box1.p1.y < 0) {
            collisions.push({
              type: 'wall',
              wall: 'top',
              id: id1
            })
          } else if (box1.p2.y >= this.worldSize.y) {
            collisions.push({
              type: 'wall',
              wall: 'bottom',
              id: id1
            })
          }
        }
      }
    }

    return collisions
  }
}

module.exports = CollisionDetector