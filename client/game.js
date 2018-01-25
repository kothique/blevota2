import 'pixi.js'
import merge from 'lodash/merge'
import get from 'lodash/get'

import World from '../common/world'
import Keyboard from './keyboard'
import { createOrb, renderOrb } from './orb'
import FrameReceiver from './framereceiver';

export default class Game {
  static wsHost = 'ws://localhost:3000/'

  constructor() {
    let app = this.app = new PIXI.Application({
      anitalias: true
    })

    app.view.style.position = 'absolute'
    app.view.style.display = 'block'
    app.renderer.autoResize = true
    app.renderer.resize(window.innerWidth, window.innerHeight)
    app.renderer.backgroundColor = 0xEEEEEE

    Keyboard.listen('KeyA')
    Keyboard.listen('KeyD')
    Keyboard.listen('KeyW')
    Keyboard.listen('KeyS')

    Keyboard.on('change', () => {
      this.sendControls()
    })

    // setInterval(() => {
    //   this.sendControls()
    // }, 1000 / 60)

    let ws = this.ws = new WebSocket(Game.wsHost)

    ws.onopen = (event) => {
      this.onopen && this.onopen(Game.wsHost)
    }

    ws.onerror = (event) => {
      this.onerror && this.onerror(event.error)
    }

    ws.onclose = (event) => {
      this.onclose && this.onclose(event.code)
    }

    ws.onmessage = (event) => {
      let msg = JSON.parse(event.data)

      this.onmessage && this.onmessage(msg)

      if (msg.type === 'ERROR')
      {
        this.onerror && this.onerror(msg.error)
        dispatch(push('/login'))
      }
      else if (msg.type === 'WORLD')
      {
        this.state = msg.state

        this.frameReceiver = new FrameReceiver(this.state)
        this.frameReceiver.on('frame', (diff) => {
          if (get(diff, 'x')) {
            this.orb.x = diff.x
          }

          if (get(diff, 'orb.y')) {
            this.orb.y = diff.y
          }

          if (get(diff, 'meta')) {
            this.orb.meta = merge(this.orb.meta, diff.meta)

            renderOrb(this.orb)
          }
        }) 
        this.frameReceiver.start()

        let { meta, x, y } = { ...this.state, meta: {} }
        this.orb = createOrb(meta)
        this.orb.position.set(x, y)
        this.app.stage.addChild(this.orb)
      }
      else if (msg.type === 'DIFF')
      {
        this.frameReceiver.putFrame(msg.diff)
      }
      else
      {
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

    //console.log(`Game: sent controls: ${JSON.stringify(controls)}`)
  }

}