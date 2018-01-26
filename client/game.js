import 'pixi.js'
import merge from 'lodash/merge'
import get from 'lodash/get'

import World from '../common/world'
import Keyboard from './keyboard'
import { createOrb, renderOrb } from './orb'
import PlayoutBuffer from './playoutbuffer';

export default class Game {
  static host = 'ws://localhost:3000/'

  constructor() {
    /*
      Configure PixiJS application
    */
    let app = this.app = new PIXI.Application({
      anitalias: true
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
      Configure keyboard listener
    */
    Keyboard.listen('KeyA')
    Keyboard.listen('KeyD')
    Keyboard.listen('KeyW')
    Keyboard.listen('KeyS')

    Keyboard.on('change', () => {
      this.sendControls()
    })

    /*
      Configure playout buffer
    */
    this.buffer = new PlayoutBuffer()
    this.buffer.on('frame', ({ frame, timestamp }) => {
      const { x, y, v } = frame

      this.orb.position.set(x, y)
      this.orb.meta.v = v
      renderOrb(this.orb)
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
          frame: msg.frame,
          timestamp: msg.timestamp
        })
      } else {
        console.log(`Invalid websocket message type: ${msg.type}`)
      }
    }
  }

  sendControls = () => {
    const { KeyA, KeyD, KeyW, KeyS } = Keyboard.controls

    const controls = {
      left: KeyA,
      right: KeyD,
      up: KeyW,
      down: KeyS
    }

    this.ws.send(JSON.stringify({
      type: 'CONTROLS',
      controls,
      time: Date.now()
    }))

    // console.log(`Game: sent controls: ${JSON.stringify(controls)}`)
  }

}