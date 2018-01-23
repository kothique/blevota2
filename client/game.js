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

    Keyboard.listen('ArrowLeft')
    Keyboard.listen('ArrowRight')
    Keyboard.listen('ArrowUp')
    Keyboard.listen('ArrowDown')

    Keyboard.on('change', () => {
      this.sendControls()
    })

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
        this.data = msg.data

        this.frameReceiver = new FrameReceiver(this.data)
        this.frameReceiver.on('frame', (diff) => {
          if (get(diff, 'orb.x')) {
            this.orb.x = diff.orb.x
          }

          if (get(diff, 'orb.y')) {
            this.orb.y = diff.orb.y
          }

          if (get(diff, 'meta')) {
            this.orb.meta = merge(this.orb.meta, diff.meta)

            renderOrb(this.orb)
          }
        }) 
        this.frameReceiver.start()

        let { meta, x, y } = this.data.orb
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
    const { ArrowLeft, ArrowRight, ArrowUp, ArrowDown } = Keyboard.controls

    const controls = {
      left: ArrowLeft,
      right: ArrowRight,
      up: ArrowUp,
      down: ArrowDown
    }

    this.ws.send(JSON.stringify({
      type: 'CONTROLS',
      controls
    }))

    //console.log(`Game: sent controls: ${JSON.stringify(controls)}`)
  }

}