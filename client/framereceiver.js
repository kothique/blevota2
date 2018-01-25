import EventEmitter from 'events'
import merge from 'lodash/merge'

export default class FrameReceiver extends EventEmitter {
  constructor(initialState) {
    super()

    this.state1 = this.state2 = initialState
    this.stop = false
  }

  put = (frame) => {
    //this.frames.enqueue(frame)

    this.state1 = this.state2
    this.state2 = merge(this.state1, frame)
  }

  start = () => {
    this.stop = false

    const nextFrame = () => {
      if (this.stop) {
        return
      }

      this.emit('frame', this.state2)

      requestAnimationFrame(nextFrame)
    }

    requestAnimationFrame(nextFrame)
  }

  stop = () => {
    this.stop = true
  }
}