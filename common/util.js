/**
 * @module common/util
 */

const { Vector, V } = require('./vector')

/**
 * Binds arguments to the function without
 * changing `this`.
 *
 * @name Function#bindArgs
 * @method
 * @memberof! <global>
 *
 * @param {...*} boundArgs - The arguments to be bound.
 * @return {function} - The resulting function.
 */
Function.prototype.bindArgs = function (...boundArgs) {
  return (...args) => this.call(this, ...boundArgs, ...args)
}

/**
 * Compare two floats.
 *
 * @name Number#equals
 * @method
 * @memberof! <global>
 *
 * @param {number} n
 * @param {?number} e - Accuracy.
 * @return {bool}
 */
Number.prototype.equals = function (n, e = 1e-2) {
  return Math.abs(this - n) <= e
}

const SVG = {
  /**
   * Create a circle bar <path>.'d' attribute.
   *
   * @param {Vector} center - The center of the bar.
   * @param {number} radius1 - The inner radius.
   * @param {number} radius2 - The outer radius.
   * @param {number} value - Value: [0..1].
   * @return {string} - The 'd' attribute for a <path> element.
   */
  circleBar(center, radius1, radius2, value) {
    value = value - 0.5 - 0.0001

    let d = `M ${center.x - radius2} ${center.y}`

    const x2 = center.x + Math.cos(2 * Math.PI * value) * radius2,
          y2 = center.y + Math.sin(2 * Math.PI * value) * radius2

    if (value < 0) {
      d += ` A ${radius2} ${radius2} 0 0 1 ${x2} ${y2}`
    } else {
      d += ` A ${radius2} ${radius2} 0 1 1 ${x2} ${y2}`
    }

    const x3 = center.x + Math.cos(2 * Math.PI * value) * radius1,
          y3 = center.y + Math.sin(2 * Math.PI * value) * radius1

    d += ` L ${x3} ${y3}`

    if (value < 0) {
      d += ` A ${radius1} ${radius1} 0 0 0 ${center.x - radius1} ${center.y}`
    } else {
      d += ` A ${radius1} ${radius1} 0 1 0 ${center.x - radius1} ${center.y}`
    }

    d += ' Z'
    
    return d
  }
}
module.exports.SVG = SVG

/**
 * Method that always throws. Useful to create abstract methods.
 *
 * @throws {Error}
 */
const abstract = function abstract() {
  throw Error('this method must be overrided')
}
module.exports.abstract = abstract