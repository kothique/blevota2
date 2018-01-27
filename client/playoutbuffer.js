import EventEmitter from 'events'
import Queue from '../common/queue'
import merge from 'lodash/merge'
import present from 'present'

import World from '../common/world'

export default class PlayoutBuffer extends EventEmitter {
  constructor() {
    super()

    this.stop = false
    this.latency = 60
    this.frames = new Queue
  }

  clear = () => {
    this.frames.clear()
  }

  put = ({ state, timestamp }) => {
    const firstFrame = !this.frames.length

    if (firstFrame) {
      this.beginFrames = timestamp
    }
    
    this.frames.enqueue({
      state,
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

      const approximatedState = new World(frame.state)
        .integrate(currentTimestamp, currentTimestamp - frame.timestamp)
        .state

      this.emit('frame', { state: approximatedState, currentTimestamp })

      requestAnimationFrame(nextFrame)
    }

    requestAnimationFrame(nextFrame)
  }

  stop = () => {
    this.stop = true
  }
}