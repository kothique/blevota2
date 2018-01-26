module.exports = class Queue {
  constructor() {
    this.data = []
  }

  enqueue(elem) {
    this.data.push(elem)
  }

  peek() {
    return this.data[0]
  }

  dequeue() {
    return this.data.shift()
  }

  get length() {
    return this.data.length
  }

  clear() {
    this.data = []
  }
}