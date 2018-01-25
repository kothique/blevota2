import EventEmitter from 'events'
import merge from 'lodash/merge'

export default class FrameReceiver extends EventEmitter {
  constructor(initialState) {
    super()

    this.state = initialState
    this.stop = false
  }

  put = (frame) => {
    this.state = merge(this.state, frame)
  }

  start = () => {
    this.stop = false

    const nextFrame = () => {
      if (this.stop) {
        return
      }

      this.emit('frame', this.state)

      requestAnimationFrame(nextFrame)
    }

    requestAnimationFrame(nextFrame)
  }

  stop = () => {
    this.stop = true
  }
}