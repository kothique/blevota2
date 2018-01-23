class Queue {
  constructor() {
    this.items = []
  }

  enqueue(item) {
    this.items.push(item)
  }

  dequeue(n = 1) {
    const result = this.items[n - 1]
    this.items.splice(0, n)

    return result
  }

  peek() {
    return this.items[0]
  }

  empty() {
    return this.items.length === 0
  }

  get length() {
    return this.items.length
  }
}

module.exports = Queue