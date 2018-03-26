/**
 * @module client/game/skills/skill
 */

/** @class */
class Skill {
  /**
   * @param {object} options
   * @param {Orb}    options.owner
   */
  constructor(options) {
    this.api = options.skillAPI

    this.owner = options.owner
    this.node  = options.owner.node
    this.nodes = options.owner.nodes

    this.on = this.prevOn = false
  }

  /**
   * @param {number} t
   * @param {number} dt
   */
  render(viewport, t, dt) {
    if (!this.prevOn && this.on) {
      this.startAnimation(viewport, t)
    } else if (this.prevOn && !this.on) {
      this.endAnimation(viewport, t)
    }

    if (this.on) {
      this.animate(viewport, t, dt)
    }
  }

  /**
   * @param {number} t
   * @virtual
   */
  startAnimation(t) {}

  /**
   * @param {number} t
   * @param {number} dt
   * @virtual
   */
  animate(viewport, t, dt) {}


  /**
   * @param {number} t
   * @virtual
   */
  endAnimation(t) {}

  /**
   * @param {Buffer} buffer
   * @param {number} offset
   * @return {number}
   * @virtual
  */
  parse(buffer, offset = 0) {
    this.prevOn = this.on
    this.on = buffer.readUInt8(offset++)

    return offset
  }
}

export default Skill