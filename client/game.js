import 'pixi.js'

import World from '../common/world'
import Keyboard from './keyboard'
import { createOrb, renderOrb } from './orb'

export default class Game {
  static wsHost = 'ws://localhost:3000/'

  first = true

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

      switch (msg.type) {
        case 'ERROR':
          this.onerror && this.onerror(msg.error)
          dispatch(push('/login'))

          break
        case 'WORLD':
          this.data = msg.data

          let { meta, x, y } = msg.data.orb

          if (this.first) {
            this.orb = createOrb(meta)
            this.app.stage.addChild(this.orb)

            this.first = false
          }

          renderOrb(this.orb, meta)

          this.orb.position.set(x, y)

          break
        default:
          console.log(`Invalid websocket message type: ${msg.type}`)
      }
    }
  }

  sendControls = () => {
    this.ws.send(JSON.stringify({
      type: 'CONTROLS',
      controls: Keyboard.controls
    }))

    //console.log(`Game: sent controls: ${JSON.stringify(Keyboard.controls)}`)
  }

}