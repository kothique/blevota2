import EventEmitter from 'events'
import ioc from 'socket.io-client'
import get from 'lodash/get'
import { Buffer } from 'buffer-browserify'

import Keyboard from './keyboard'
import PlayoutBuffer from './playoutbuffer';
import World from './game/world'

import * as entities from '../common/entities'

export default class Game extends EventEmitter {
  static host = 'http://localhost:3000/'

  constructor(options) {
    super()

    const { context, info, host, token, user, matchId } = options
    this.user = user
    this.matchId = matchId

    /*
      Configure the scene
    */
    this.svg = context
    this.info = info

    World.init(this.svg, this.info)

    this.svg.addEventListener('mousemove', ({ offsetX, offsetY }) => {
      this.sendControls({
        pX: offsetX,
        pY: offsetY
      })
    })

    this.svg.addEventListener('mouseup', ({ offsetX, offsetY, button }) => {
      const controls = {
        pX: offsetX,
        pY: offsetY
      }

      if (button === 0) {
        controls.move = false
      }

      this.sendControls(controls)
    })

    this.svg.addEventListener('mousedown', ({ offsetX, offsetY, button }) => {
      const controls = {
        pX: offsetX,
        pY: offsetY
      }

      if (button === 0) {
        controls.move = true
      }

      this.sendControls(controls)
    })

    document.addEventListener('keyup', (event) => {
      const controls = Object.create(null)

      if (event.keyCode === 32) {
        controls.skill1 = false
        event.preventDefault()
      }

      if (Object.keys(controls).length !== 0) {
        this.sendControls(controls)
      }
    })

    document.addEventListener('keydown', (event) => {
      const controls = Object.create(null)

      if (event.keyCode === 32) {
        controls.skill1 = true
        event.preventDefault()
      }

      if (Object.keys(controls).length !== 0) {
        this.sendControls(controls)
      }
    })

    /*
      Configure playout buffer
    */
    this.buffer = new PlayoutBuffer()
    this.buffer.on('frame', (
      previousFrame,
      frame,
      currentTimestamp
    ) => {
      if (frame) {
        World.parse(frame.buffer)

        if (previousFrame) {
          World.extrapolate(
            previousFrame.timestamp,
            frame.timestmap,
            currentTimestamp
          )
        }

        // for (const id in World.entities) {
        //   const orb = orbs[id]

        //   this.info.innerHTML = `
        //     t: ${timestamp.toFixed(4)}<br />
        //     f: ${orb.force.toString(n => n.toFixed(4))}<br />
        //     p: ${orb.position.toString(n => n.toFixed(4))}<br />
        //     v: ${orb.velocity.toString(n => n.toFixed(4))}<br />
        //     a: ${orb.acceleration.toString(n => n.toFixed(4))}<br />
        //     hp: ${orb.hp} / ${orb.maxHp}<br />
        //     mp: ${orb.mp} / ${orb.maxMp}<br />`

        //   this.scene.updateOrb(id, {
        //     radius:   orb.radius,
        //     position: orb.position,
        //     maxHp:    orb.maxHp,
        //     hp:       orb.hp,
        //     maxMp:    orb.maxMp,
        //     mp:       orb.mp
        //   })
        // }
      }
    })

    /*
      Configure keyboard listener
    */
    Keyboard.on('change', () => {
      this.sendControls(Keyboard.getControls())
    })

    /*
      Connect to the game host with socket.io
    */
    const socket = this.socket = ioc(Game.host, {
      query: {
        token,
        matchId: this.matchId
      }
    })

    socket.on('connect', () => {
      this.emit('connect')
    })

    socket.on('connect_error', (err) => {
      this.emit('connect_error', err)
    })

    socket.on('error', (err) => {
      this.emit('error', err)
    })

    socket.on('disconnect', () => {
      this.emit('disconnect')
    })

    socket.on('frame', (frame) => {
      this.buffer.put({
        buffer: new Buffer(frame.buffer.data),
        timestamp: frame.timetamp
      })
    })

    socket.on('new-orb', (id) => {
      World.new(id, entities.ORB)
    })

    socket.on('remove-orb', (id) => {
      World.remove(id)
    })
  }

  sendControls = (controls) => {
    this.socket.emit('controls', controls)
  }

  stop = () => {
    World.clear()
    this.socket.disconnect()
  }
}
