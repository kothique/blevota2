/**
 * @module common/util
 */

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
Function.prototype.bindArgs = function bindArgs(...boundArgs) {
  return (...args) => this.call(this, ...boundArgs, ...args)
}