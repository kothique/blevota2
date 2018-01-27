import 'pixi.js'
import merge from 'lodash/merge'
import get from 'lodash/get'

import World from '../common/world'
import Keyboard from './keyboard'
import { createOrb, renderOrb } from './orb'
import PlayoutBuffer from './playoutbuffer';

const prepareControls = (controls) => {
  const { KeyA, KeyD, KeyW, KeyS } = Keyboard.controls

  return {
    left: KeyA,
    right: KeyD,
    up: KeyW,
    down: KeyS
  }
}

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

    this.orb = createOrb({ v: { x: 0, y: 0 } })
    this.orb.position.set(0, 0)
    this.app.stage.addChild(this.orb)

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
    Keyboard.listen('KeyA')
    Keyboard.listen('KeyD')
    Keyboard.listen('KeyW')
    Keyboard.listen('KeyS')

    Keyboard.on('change', () => {
      const controls = prepareControls(Keyboard.controls)

      this.sendControls(controls)
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