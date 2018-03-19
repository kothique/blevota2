/**
 * @module common/const
 */
const { Vector, V } = require('./vector')

/** @const */
const VISION_RADIUS = V(1366, 768).divide(2)
module.exports.VISION_RADIUS = VISION_RADIUS

/** @const */
const ORBS = {
  UNKNOWN: 0x0,
  RED:     0x1,
  GOLD:    0x2,
  GREEN:   0x3
}
module.exports.ORBS = ORBS

/** @return {number} */
const randomOrbType = () => 1 + Math.floor(Math.random() * (Object.keys(ORBS).length - 1))
module.exports.randomOrbType = randomOrbType