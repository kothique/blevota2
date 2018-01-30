import merge from 'lodash/merge'
import get from 'lodash/get'

import Keyboard from './keyboard'
import PlayoutBuffer from './playoutbuffer';

export default class Game {
  static host = 'ws://localhost:3000/'

  constructor(context, userId) {
    this.userId = userId

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
        if (id === this.userId) {
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
      Connect to the game host with WebSocket
    */
    let ws = this.ws = new WebSocket(Game.host)

    ws.onopen = (event) => {
      this.onopen && this.onopen(Game.host)
    }

    ws.onerror = (event) => {
      this.onerror && this.onerror(event.error)
    }

    ws.onclose = (event) => {
      this.onclose && this.onclose(event)
    }

    let c = 0

    ws.onmessage = (event) => {
      let msg = JSON.parse(event.data)

      this.onmessage && this.onmessage(msg)

      if (msg.type === 'ERROR') {
        this.onerror && this.onerror(msg.error)
      } else if (msg.type === 'FRAME') {
        this.buffer.put(msg.frame)
      }
    }
  }

  sendControls = (controls) => {
    this.ws.send(JSON.stringify({
      type: 'CONTROLS',
      controls
    }))
  }
}