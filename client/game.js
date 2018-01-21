import 'pixi.js'
import merge from 'lodash/merge'

import World from '../common/world'
import Keyboard from './keyboard'
import { createOrb, renderOrb } from './orb'

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

    let ws = this.ws = new WebSocket(Game.wsHost)

    ws.onopen = (event) => {
      this.onopen && this.onopen(Game.wsHost)

      setInterval(this.sendControls, 1000 / 60)
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

      if (msg.type === 'ERROR') {
        this.onerror && this.onerror(msg.error)
        dispatch(push('/login'))
      } else if (msg.type === 'WORLD') {
        this.data = msg.data

        let { meta, x, y } = this.data.orb

        this.orb = createOrb(meta)
        this.orb.position.set(x, y)
        this.app.stage.addChild(this.orb)
      } else if (msg.type === 'DIFF') {
        this.data = merge(this.data, msg.diff)

        let { meta, x, y } = this.data.orb
        renderOrb(this.orb, meta)
        this.orb.position.set(x, y)
      } else {
        console.log(`Invalid websocket message type: ${msg.type}`)
      }
    }
  }

  sendControls = () => {
    const { ArrowLeft, ArrowRight, ArrowUp, ArrowDown } = Keyboard.controls

    let controls = {
      left: ArrowLeft,
      right: ArrowRight,
      up: ArrowUp,
      down: ArrowDown
    }

    this.ws.send(JSON.stringify({
      type: 'CONTROLS',
      controls
    }))

    //console.log(`Game: sent controls: ${JSON.stringify(Keyboard.controls)}`)
  }

}