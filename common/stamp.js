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
      const { init, proto, instance, enclose } = this.meta

      /** Delegate prototype. */
      const obj = _.create(proto)

      /** Instance properties. */
      _.extend(obj, instance)

      /** Initialize. */
      init.apply(obj, args)

      /** Create enclosed private data. */
      enclose.call(obj)

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

  _.extend(
    proto,
    stamp2.meta.proto,
    {
      _parent: stamp1.meta
    }
  )

  return stamp({
    init(...args) {
      // Only run the last init
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