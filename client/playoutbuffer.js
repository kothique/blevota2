import EventEmitter from 'events'
import List from 'collections/list'
import merge from 'lodash/merge'
import present from 'present'

import World from '../common/world'

export default class PlayoutBuffer extends EventEmitter {
  constructor() {
    super()

    this.stop = false
    this.latency = 60
    this.frames = new List
  }

  clear = () => {
    this.frames.clear()
  }

  put = ({ state, timestamp }) => {
    const firstFrame = !this.frames.peek()

    if (firstFrame) {
      this.beginFrames = timestamp
    }
    
    this.frames.push({
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
     * Find the frame in the queue closest to the current moment.
     * 
     * @param {number} currentTimestamp
     * @returns {object|null}
     */
    const getFrame = (currentTimestamp) => {
      let previousFrame, currentFrame

      while (currentFrame = this.frames.peek()) {
        if (currentFrame.timestamp < currentTimestamp) {
          this.frames.shift()
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

      if (frame) {
        const approximatedState = new World(frame.state)
          .integrate(currentTimestamp, currentTimestamp - frame.timestamp)
          .state

        this.emit('frame', {
          state: approximatedState,
          timestamp: currentTimestamp
        })
      }

      requestAnimationFrame(nextFrame)
    }

    requestAnimationFrame(nextFrame)
  }

  stop = () => {
    this.stop = true
  }
}