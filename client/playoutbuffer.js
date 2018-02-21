import EventEmitter from 'events'
import List from 'collections/list'
import merge from 'lodash/merge'
import present from 'present'

import { V } from '../common/vector'
import World from '../common/world'
import State from '../common/state'

export default class PlayoutBuffer extends EventEmitter {
  constructor() {
    super()

    this.stop = false
    this.latency = 60
    this.frames = new List
    this.previous = [null, null]
 
    this.firstFrame = true
  }

  clear = () => {
    this.frames.clear()
  }

  put = ({ state, timestamp }) => {
    if (this.firstFrame) {
      this.beginFrames = timestamp
    }

    this.frames.push({
      state,
      timestamp: timestamp - this.beginFrames
    })

    if (this.firstFrame) {
      setTimeout(this.start, this.latency)
      this.firstFrame = false
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
      let currentFrame

      while (currentFrame = this.frames.peek()) {
        if (currentFrame.timestamp < currentTimestamp) {
          this.frames.shift()
        } else {
          return {
            frame: this.previous[0],
            prevFrame: this.previous[1]
          }
        }

        this.previous[1] = this.previous[0]
        this.previous[0] = currentFrame
      }

      return {
        frame: this.previous[0],
        prevFrame: this.previous[1]
      }
    }

    const nextFrame = () => {
      if (this.stop) {
        return
      }

      const currentTimestamp = present() - this.begin,
            { frame, prevFrame } = getFrame(currentTimestamp)

      if (frame) {
        let { state } = prevFrame
          ? new World(V(800, 600), frame.state).extrapolate(prevFrame, frame.timestamp, currentTimestamp)
          : frame

        this.emit('frame', {
          state,
          timestamp: currentTimestamp
        })
      }

      window.requestAnimationFrame(nextFrame)
    }

    window.requestAnimationFrame(nextFrame)
  }

  stop = () => {
    this.stop = true
  }
}