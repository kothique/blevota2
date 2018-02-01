import EventEmitter from 'events'
import ioc from 'socket.io-client'
import get from 'lodash/get'

import Keyboard from './keyboard'
import PlayoutBuffer from './playoutbuffer';

export default class Game extends EventEmitter {
  static host = 'http://localhost:3000/'

  constructor(options) {
    super()

    const { context, host, token, user } = options
    this.user = user

    /*
      Configure the scene
    */
    this.svg = context

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
          const { x, y } = orbs[id]

          this.orb.setAttributeNS(null, 'cx', x)
          this.orb.setAttributeNS(null, 'cy', y)
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