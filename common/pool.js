/**
 * @module common/pool
 */

class Pool {
  constructor(options) {
    this._create   = options.create
    this._onReturn = options.onReturn
    this._onGet    = options.onGet

    this._allocated = []
    this._inUse     = []
    this._allocate(options.initial || 10)
  }

  _allocate(count) {
    while (count-- > 0) {
      this._allocated.push(this._create())
    }
  }

  _return(obj) {
    this._allocated.push(obj)
    this._onReturn(obj)
  }

  get(n = 1) {
    if (n > this._inUse.length) {
      if (this._allocated.length < n - this._inUse.length) {
        this._allocate(n - this._inUse.length - this._allocated.length)
      }

      for (let i = 0; i < n - this._inUse.length; i++) {
        const obj = this._allocated.pop()
        this._onGet(obj)
        this._inUse.push(obj)
      }
    } else if (n < this._inUse.length) {
      for (let i = 0; i < this._inUse.length - n; i++) {
        const obj = this._inUse.pop()
        this._return(obj)
      }
    }

    return this._inUse
  }

  returnAll() {
    this.get(0)
  }
}

module.exports = Pool