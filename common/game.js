/**
 * @module common/game
 */

const { Vector, V } = require('./vector')

/**
 * @constant
 */
const VISION_RADIUS = V(1500, 1500).divide(2)
module.exports.VISION_RADIUS = VISION_RADIUS

/**
 * Convert global position to SVG viewBox position.
 *
 * @param {Node}   svg
 * @param {Vector} point
 * @return {Vector}
 */
const globalToSVG = (svg, point) => {
  let svgPoint = svg.createSVGPoint()
  svgPoint.x = point.x
  svgPoint.y = point.y
  svgPoint = svgPoint.matrixTransform(svg.getScreenCTM().inverse())

  return V(svgPoint.x, svgPoint.y)
}
module.exports.globalToSVG = globalToSVG

/**
 * Convert SVG viewBox position to global position.
 *
 * @param {Node}   svg
 * @param {Vector} point
 * @return {Vector}
 */
const svgToGlobal = (svg, point) => {
  let svgPoint = svg.createSVGPoint()
  svgPoint.x = point.x
  svgPoint.y = point.y
  svgPoint = svgPoint.matrixTransform(svg.getScreenCTM())

  return V(svgPoint.x, svgPoint.y)
}
module.exports.svgToGlobal = svgToGlobal

/**
 * Get viewBox min and max points.
 *
 * @param {Node} svg
 * @return {object}
 */
const getViewBox = (svg) => {
  return {
    minP: svgToGlobal(svg, V(0, 0)),
    maxP: svgToGlobal(svg, V(VISION_RADIUS.x * 2 - 1, VISION_RADIUS.y * 2 - 1)),
    scale: svg.getScreenCTM().a
  }
}
module.exports.getViewBox = getViewBox