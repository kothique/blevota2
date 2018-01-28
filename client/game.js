import 'pixi.js'
import merge from 'lodash/merge'
import get from 'lodash/get'

import Keyboard from './keyboard'
import { createOrb, renderOrb } from './orb'
import PlayoutBuffer from './playoutbuffer';

export default class Game {
  static host = 'ws://localhost:3000/'

  constructor(view) {
    /*
      Configure PixiJS application
    */
    let app = this.app = new PIXI.Application({
      view,
      antialias: true
    })

    app.view.style.position = 'absolute'
    app.view.style.display = 'block'
    app.renderer.autoResize = true
    app.renderer.resize(window.innerWidth, window.innerHeight)
    app.renderer.backgroundColor = 0xEEEEEE

    this.orb = createOrb({ dir: 0, v: 0 })
    this.orb.position.set(0, 0)
    this.app.stage.addChild(this.orb)

    const btnName = {
      0: 'lmb',
      1: 'wheel',
      2: 'rmb'
    }

    app.view.addEventListener('mousemove', ({ clientX, clientY }) => {
      this.sendControls({
        mX: clientX,
        mY: clientY
      })
    })

    app.view.addEventListener('mouseup', ({ clientX, clientY, button }) => {
      this.sendControls({
        mX: clientX,
        mY: clientY,
        [btnName[button]]: false
      })
    })

    app.view.addEventListener('mousedown', ({ clientX, clientY, button }) => {
      this.sendControls({
        mX: clientX,
        mY: clientY,
        [btnName[button]]: true
      })
    })

    /*
      Configure playout buffer
    */
    this.buffer = new PlayoutBuffer()
    this.buffer.on('frame', ({ state, timestamp }) => {
      const { x, y, v } = state

      this.orb.position.set(x, y)
      this.orb.meta.v = v
      renderOrb(this.orb)
    })

    /*
      Configure keyboard listener
    */
    // Keyboard.listen(...)

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
      this.onclose && this.onclose(event.code)
    }

    let c = 0

    ws.onmessage = (event) => {
      let msg = JSON.parse(event.data)

      this.onmessage && this.onmessage(msg)

      if (msg.type === 'ERROR') {
        this.onerror && this.onerror(msg.error)
        dispatch(push('/login'))
      } else if (msg.type === 'FRAME') {
        this.buffer.put({
          state: msg.state,
          timestamp: msg.timestamp
        })
      } else {
        console.log(`Invalid websocket message type: ${msg.type}`)
      }
    }
  }

  sendControls = (controls) => {
    this.ws.send(JSON.stringify({
      type: 'CONTROLS',
      controls,
      time: Date.now()
    }))

    // console.log(`Game: sent controls: ${JSON.stringify(controls)}`)
  }

}