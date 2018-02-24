/**
 * @module server/stamp
 *
 * @description
 * A stamp is an example object by which other objects
 * are created. The module is created to provide
 * full-featured prototypal object model with three kinds
 * of inheritance:
 *  - delegation
 *  - cloning inheritance (mixins)
 *  - functional inheritance
 */

const _ = require('lodash')

/**
 * Create a new stamp.
 *
 * @param {?object} options
 * @param {?function} options.init    - Initializes the object.
 * @param {?object} options.proto     - Delegate prototype.
 * @param {?object} options.instance  - Instance properties.
 * @param {?function} options.enclose - Use it to create private enclosed data.
 */
const stamp = function stamp(options = {}) {
  return {
    meta: {
      init:     options.init || function init() {},
      proto:    options.proto || {},
      instance: options.instance || {},
      enclose:  options.enclose || function enclose() {}
    },

    /**
     * Create a new instance of the stamp.
     *
     * @param {...any} args
     * @return {object}
     */
    create(...args) {
      /** Delegate prototype. */
      const obj = _.create(this.meta.proto)

      /** Instance properties. */
      _.extend(obj, this.meta.instance)

      /** Create enclosed private data. */
      this.meta.enclose.call(obj)

      /** Initialize. */
      this.meta.init.apply(obj, args)

      return obj
    }
  }
}
module.exports.stamp = stamp

/**
 * Compose two stamps.
 *
 * @param {object} stamp1
 * @param {object} stamp2
 */
const compose2 = function (stamp1, stamp2) {
  const proto = _.create(stamp1.meta.proto)
  _.extend(proto, stamp2.meta.proto)

  return stamp({
    init(...args) {
      stamp1.meta.init.apply(this, args)
      stamp2.meta.init.apply(this, args)
    },
    proto,
    instance: _.extend(stamp1.meta.instance, stamp2.meta.instance),
    enclose() {
      stamp1.meta.enclose.apply(this)
      stamp2.meta.enclose.apply(this)
    }
  })
}
module.exports.compose2 = compose2

/**
 * Compose several stamps.
 *
 * @param {...object} stamps
 * @return {object}
 */
const compose = function compose(...stamps) {
  return stamps.reduce(compose2)
}
module.exports.compose = compose