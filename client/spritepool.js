import List from 'collections/list'
import 'pixi.js'

export default class SpritePool {
  available = new List
  inUse = new List

  get = () => {
    let object
    if (object = this.available.peek()) {
      this.available.shift()
      this.inUse.unshift(object)

      return object
    } else {
      object = new PIXI.Sprite
      this.inUse.unshift(object)

      return object
    }
  }

  release = (object) => {
    this.inUse.delete(object)
    this.available.unshift(object)
  }

  releaseAll = () => {
    for (let object in this.inUse) {
      this.available.unshift(object)
    }

    this.inUse.clear()
  }
}