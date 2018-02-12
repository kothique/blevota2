/**
 * @module server/matches
 */

const uuid = require('uuid')

const Match = require('./match')

/**
 * Collection of all matches.
 *
 * @type {object}
 */
const matches = Object.create(null)
module.exports.matches = matches

function createMatch() {
  const match = new Match(uuid())
  match.start()

  matches[match.id] = match

  return match
}
module.exports.createMatch = createMatch

function removeMatch(id) {
  delete matches[id]
}
module.exports.removeMatch = removeMatch
