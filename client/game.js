import EventEmitter from 'events'
import ioc from 'socket.io-client'
import get from 'lodash/get'
import { Buffer } from 'buffer-browserify'

import Keyboard from './keyboard'
import PlayoutBuffer from './playoutbuffer';
import State from '../common/state'

export default class Game extends EventEmitter {
  static host = 'http://localhost:3000/'

  constructor(options) {
    super()

    const { context, info, host, token, user } = options
    this.user = user

    /*
      Configure the scene
    */
    this.svg = context
    this.info = info

    this.orb = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    this.orb.setAttributeNS(null, 'cx', 0)
    this.orb.setAttributeNS(null, 'cy', 0)
    this.orb.setAttributeNS(null, 'r', 30)
    this.orb.style.fill = 'rbg(150, 0, 30)'
    this.svg.appendChild(this.orb)

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

      for (let id in orbs) {
        // only one user can be rendered by now,
        // but it will be fixed soon
        if (id === this.user.id) {
          const { position } = orbs[id]

          this.orb.setAttributeNS(null, 'cx', position.x)
          this.orb.setAttributeNS(null, 'cy', position.y)
        }
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
      query: `token=${token}`
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
      const orb = frame.state.orbs['5a58ef9aa4dcc91835c9fd23']
      this.info.innerHTML = `
        t: ${frame.timestamp.toFixed(4)}<br />
        f: ${orb.force.toString(n => n.toFixed(4))}<br />
        p: ${orb.position.toString(n => n.toFixed(4))}<br />
        v: ${orb.velocity.toString(n => n.toFixed(4))}<br />
        a: ${orb.acceleration.toString(n => n.toFixed(4))}<br />`
      this.buffer.put(frame)
    })
  }

  sendControls = (controls) => {
    this.socket.emit('controls', controls)
  }

  stop = () => {
    this.socket.disconnect()
  }
}