import EventEmitter from 'events'
import merge from 'lodash/merge'
import present from 'present'

import { V } from '../common/vector'

/**
 * @class
 *
 * @emits frame - { previousFrame, frame, currentTimestamp }
 */
export default class PlayoutBuffer extends EventEmitter {
  constructor() {
    super()

    this.stop = false
    this.latency = 30
    this.frames = []
 
    this.isFirstFrame = true
  }

  clear = () => {
    this.frames = []
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
      this.timeoutID = window.setTimeout(this.start, this.latency)
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
    const getFrames = (nextTimestamp) => {
      let next,
          frames = {
            prev: null,
            curr: null
          }

      while (next = this.frames[0]) {
        if (next.timestamp < nextTimestamp || this.frames[1] === undefined) {
          this.frames.shift()
        } else {
          return frames
        }

        frames.prev = frames.curr
        frames.curr = next
      }

      return frames
    }

    const nextFrame = () => {
      if (this.stop) {
        return
      }

      const currentTimestamp = present() - this.begin

      const {
        prev: previousFrame,
        curr: frame
      } = getFrames(currentTimestamp)

      this.emit('frame', {
        previousFrame,
        frame,
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