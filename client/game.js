import EventEmitter from 'events'
import ioc from 'socket.io-client'
import get from 'lodash/get'
import { Buffer } from 'buffer-browserify'

import Keyboard from './keyboard'
import PlayoutBuffer from './playoutbuffer';
import State from '../common/state'
import Scene from './scene'

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
    this.scene = new Scene(this.svg)

    const buttonName = {
      0: 'lmb',
      1: 'wheel',
      2: 'rmb'
    }

    this.svg.addEventListener('mousemove', ({ clientX, clientY }) => {
      this.sendControls({
        mX: clientX,
        mY: clientY
      })
    })

    this.svg.addEventListener('mouseup', ({ clientX, clientY, button }) => {
      this.sendControls({
        mX: clientX,
        mY: clientY,
        [buttonName[button]]: false
      })
    })

    this.svg.addEventListener('mousedown', ({ clientX, clientY, button }) => {
      this.sendControls({
        mX: clientX,
        mY: clientY,
        [buttonName[button]]: true
      })
    })

    /*
      Configure playout buffer
    */
    this.buffer = new PlayoutBuffer()
    this.buffer.on('frame', ({ state, timestamp }) => {
      const { orbs } = state

      for (const id in orbs) {
        const orb = orbs[id]

        this.info.innerHTML = `
          t: ${timestamp.toFixed(4)}<br />
          f: ${orb.force.toString(n => n.toFixed(4))}<br />
          p: ${orb.position.toString(n => n.toFixed(4))}<br />
          v: ${orb.velocity.toString(n => n.toFixed(4))}<br />
          a: ${orb.acceleration.toString(n => n.toFixed(4))}<br />
          hp: ${orb.hp} / ${orb.maxHp}<br />
          mp: ${orb.mp} / ${orb.maxMp}<br />`

        this.scene.updateOrb(id, {
          radius: orb.radius,
          position: orb.position
        })
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
      const buffer = new Buffer(frame.state.data)

      frame.state = State.fromBuffer(buffer)
      this.buffer.put(frame)
    })

    socket.on('new-orb', (id) => {
      this.scene.newOrb(id)
    })

    socket.on('remove-orb', (id) => {
      this.scene.removeOrb(id)
    })
  }

  sendControls = (controls) => {
    this.socket.emit('controls', controls)
  }

  stop = () => {
    this.socket.disconnect()
  }
}
