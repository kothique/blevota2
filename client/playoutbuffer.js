import EventEmitter from 'events'
import Queue from '../common/queue'
import merge from 'lodash/merge'
import present from 'present'

export default class PlayoutBuffer extends EventEmitter {
  constructor() {
    super()

    this.stop = false
    this.latency = 60 // ms
    this.frames = new Queue
  }

  clear = () => {
    this.frames.clear()
  }

  put = ({ frame, timestamp }) => {
    const firstFrame = !this.frames.length

    if (firstFrame) {
      this.beginFrames = timestamp
    }
    
    this.frames.enqueue({
      frame,
      timestamp: timestamp - this.beginFrames
    })

    if (firstFrame) {
      setTimeout(this.start, this.latency)
    }
  }

  start = () => {
    this.begin = present()
    this.stop = false

    /**
     * Find the closest to the current moment frame in the queue
     * 
     * @param {Number} currentTimestamp
     * @returns {Object|null}
     */
    const getFrame = (currentTimestamp) => {
      let previousFrame, currentFrame

      while (currentFrame = this.frames.peek()) {
        if (currentFrame.timestamp < currentTimestamp) {
          this.frames.dequeue()
        } else {
          return previousFrame
        }

        previousFrame = currentFrame
      }

    }

    const nextFrame = () => {
      if (this.stop) {
        return
      }

      const currentTimestamp = present() - this.begin,
            frame = getFrame(currentTimestamp)

      this.emit('frame', frame)

      requestAnimationFrame(nextFrame)
    }

    requestAnimationFrame(nextFrame)
  }

  stop = () => {
    this.stop = true
  }
}