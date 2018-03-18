/**
 * @module common/const
 */
const { Vector, V } = require('./vector')

/** @const */
const VISION_RADIUS = V(1366, 768).divide(2)
module.exports.VISION_RADIUS = VISION_RADIUS

/** @const */
const ORBS = {
  UNKNOWN: 0x0
}
module.exports.ORBS = ORBS