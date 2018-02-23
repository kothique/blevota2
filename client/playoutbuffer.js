import EventEmitter from 'events'
import List from 'collections/list'
import merge from 'lodash/merge'
import present from 'present'

import { V } from '../common/vector'

/**
 * @class
 *
 * @emits frame - { frame, currentTimestamp }
 */
export default class PlayoutBuffer extends EventEmitter {
  constructor() {
    super()

    this.stop = false
    this.latency = 60
    this.frames = new List
    this.previous = [null, null]
 
    this.isFirstFrame = true
  }

  clear = () => {
    this.frames.clear()
  }

  put = ({ buffer, timestamp }) => {
    if (this.isFirstFrame) {
      this.beginFrames = timestamp
    }

    this.frames.push({
      buffer,
      timestamp: timestamp - this.beginFrames
    })

    if (this.isFirstFrame) {
      setTimeout(this.start, this.latency)
      this.isFirstFrame = false
    }
  }

  start = () => {
    this.begin = present()
    this.stop = false

    /**
     * Find the frame in the queue closest to the current moment.
     * 
     * @param {number} currentTimestamp
     * @return {object|null}
     */
    const getFrame = (currentTimestamp) => {
      let currentFrame

      while (currentFrame = this.frames.peek()) {
        if (currentFrame.timestamp < currentTimestamp) {
          this.frames.shift()
        } else {
          return
        }

        this.previous[1] = this.previous[0]
        this.previous[0] = currentFrame
      }
    }

    const nextFrame = () => {
      if (this.stop) {
        return
      }

      const currentTimestamp = present() - this.begin

      getFrame(currentTimestamp)

      this.emit('frame', {
        previousFrame: this.previous[1],
        frame: this.previous[0],
        currentTimestamp
      })

      window.requestAnimationFrame(nextFrame)
    }

    window.requestAnimationFrame(nextFrame)
  }

  stop = () => {
    this.stop = true
  }
}