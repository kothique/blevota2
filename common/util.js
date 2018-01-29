/** @module common/util */

/**
 * Binds arguments to the function without
 * changing `this`.
 *
 * @name Function#bindArgs
 * @method
 * @param {...*} boundArgs - The arguments to be bound.
 * @memberof! <global>
 */
Function.prototype.bindArgs = 
function bindArgs(...boundArgs) {
  return (...args) => this.call(this, ...boundArgs, ...args)
}
