import merge from 'lodash/merge'

import Queue from '../common/queue'

export default class FrameReceiver {
  constructor(world) {
    this.frames = new Queue

    this.state1 = this.state2 = world
    this.stop = false
  }

  on = (event, callback) => {
    if (event === 'frame') {
      this.onframe = callback
    }
  }

  putFrame = (frame) => {
    this.frames.enqueue(frame)

    this.state1 = this.state2
    this.state2 = merge(this.state1, frame)
  }

  start = () => {
    this.stop = false

    const animate = () => {
      if (this.stop) {
        return
      }

      console.log(`Frames: ${this.frames.length}`)

      if (this.frames.length === 2) {
        this.putFrame({
          orb: {
            x: 2 * this.state2.x - this.state1.x,
            y: 2 * this.state2.y - this.state1.y
          }
        })
      }

      const frame = this.frames.dequeue()
      if (this.frames.length > 3) {
        this.frames.dequeue(this.frames.length - 3)
      }

      this.onframe && this.onframe(frame)

      requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)
  }

  stop = () => {
    this.stop = true
  }
}