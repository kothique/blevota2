import merge from 'lodash/merge'

import Queue from '../common/queue'

export default class FrameReceiver {
  constructor(world) {
    this.frames = new Queue

    this.world1 = this.world2 = world
  }

  on = (event, callback) => {
    if (event === 'frame') {
      this.onframe = callback
    }
  }

  putFrame = (frame) => {
    this.frames.enqueue(frame)

    this.world1 = this.world2
    this.world2 = merge(this.world1, frame)
  }

  start = () => {
    this.intervalID = setInterval(() => {
      console.log(`Frames: ${this.frames.length}`)

      if (this.frames.length === 2) {
        this.putFrame({
          orb: {
            x: 2 * this.world2.orb.x - this.world1.orb.x,
            y: 2 * this.world2.orb.y - this.world1.orb.y
          }
        })
      }

      const frame = this.frames.dequeue()
      if (this.frames.length > 3) {
        this.frames.dequeue(this.frames.length - 3)
      }

      this.onframe && this.onframe(frame)
    }, 1000 / 60)
  }

  stop = () => {
    clearInterval(this.intervalID)
    delete this.intervalID
  }
}