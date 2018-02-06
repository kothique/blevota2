/**
 * @module common/vector
 */

/**
 * @class
 *
 * @description
 * A simple 2d vector implementation.
 */
class Vector {
  /**
   * Create a new vector.
   *
   * @param {?number} x
   * @param {?number} y
   */
  constructor(x = 0, y = 0) {
    this.x = x
    this.y = y
  }

  /**
   * Create a copy of the vector.
   *
   * @return {Vector}
   */
  clone() {
    return new Vector(this.x, this.y)
  }

  /**
   * The length of the vector.
   *
   * @return {number}
   */
  length() {
    return Math.sqrt(this.x*this.x + this.y*this.y)
  }

  /**
   * Vector equality.
   *
   * @param {Vector} v
   */
  equals(v) {
    return this.x === v.x && this.y === v.y
  }

  /**
   * Vector equality.
   *
   * @param {Vector} v1
   * @param {Vector} v2
   */
  static equal(v1, v2) {
    return v1.equals(v2)
  }

  /**
   * The angle that the vector represents in radians.
   *
   * @return {number}
   */
  angle() {
    return Math.atan2(this.y, this.x)
  }

  /**
   * Vector addition.
   *
   * @param {Vector} v
   * @chainable
   */
  add(v) {
    this.x += v.x
    this.y += v.y

    return this
  }

  /**
   * Vector addition.
   *
   * @param {Vector} v1
   * @param {Vector} v2
   * @return {Vector}
   */
  static add(v1, v2) {
    return v1.clone().add(v2)
  }

  /**
   * Vector subtraction
   *
   * @param {Vector} v
   * @chainable
   */
  subtract(v) {
    this.x -= v.x
    this.y -= v.y

    return this
  }

  /**
   * Vector subtraction.
   *
   * @param {Vector} v1
   * @param {Vector} v2
   * @return {Vector}
   */
  static subtract(v1, v2) {
    return v1.clone().subtract(v2)
  }

  /**
   * Scalar multiplication.
   *
   * @param {number} n
   * @chainable
   */
  multiply(n) {
    this.x *= n
    this.y *= n

    return this
  }

  /**
   * Scalar multiplication.
   *
   * @param {Vector} v
   * @param {number} n
   * @return {Vector}
   */
  static multiply(v, n) {
    return v.clone().multiply(n)
  }

  /**
   * Scalar multiplication by 1/n.
   *
   * @param {number} n
   * @chainable
   */
  divide(n) {
    return this.multiply(1 / n)
  }

  /**
   * Scalar multiplication by 1/n.
   *
   * @param {Vector} v
   * @param {number} n
   * @return {Vector}
   */
  static divide(v, n) {
    return Vector.multiply(v, 1 / n)
  }

  /**
   * Dot product.
   *
   * @param {Vector} v1
   * @param {Vector} v2
   */
  static dot(v1, v2) {
    return v1.x*v2.x + v1.y*v2.y
  }

  /**
   * Normalize the vector.
   *
   * @chainable
   */
  normalize() {
    const length = this.length()

    if (length !== 0) {
      this.x /= length
      this.y /= length
    }

    return this
  }

  /**
   * Create a new normalized vector.
   *
   * @return {Vector}
   */
  normalized() {
    return this.clone().normalize()
  }

  /**
   * Translate the vector to a string. If the modifier is specified,
   * apply it to the vector components.
   *
   * @param {function} modifier
   * @return {string}
   */
  toString(modifier = null) {
    return `{ x: ${modifier ? modifier(this.x) : this.x}, y: ${modifier ? modifier(this.y) : this.y} }`
  }
}

module.exports.Vector = Vector

/**
 * A convenient function for creating a vector.
 *
 * @param {number} x
 * @param {number} y
 */
function v(x, y) {
  return new Vector(x, y)
}

module.exports.v = v