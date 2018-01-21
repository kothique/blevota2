Function.prototype.bindArgs =
  function (...boundArgs) {
    return (...args) => this.call(this, ...boundArgs, ...args)
  }