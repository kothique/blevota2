import 'pixi.js'

import { World } from '../common/world'
import Keyboard from './keyboard'

export default class Game {
  static wsHost = 'ws://localhost:3000/'

  ws = null
  data = null
  app = null
  test = null

  sendControls = () => {
    this.ws.send(JSON.stringify({
      type: 'CONTROLS',
      controls: Keyboard.controls
    }))

    console.log(`Game: sent controls: ${JSON.stringify(Keyboard.controls)}`)
  }

  constructor() {
    this.app = new PIXI.Application({
      anitalias: true
    })

    this.app.view.style.position = 'absolute'
    this.app.view.style.display = 'block'
    this.app.renderer.autoResize = true
    this.app.renderer.resize(window.innerWidth, window.innerHeight)
    this.app.renderer.backgroundColor = 0xDDDDDD

    Keyboard.listen('ArrowLeft')
    Keyboard.listen('ArrowRight')
    Keyboard.listen('ArrowUp')
    Keyboard.listen('ArrowDown')

    this.test = new PIXI.Graphics()
    this.test.beginFill(0xFF0011)
    this.test.drawCircle(0, 0, 30)
    this.test.endFill()
    this.test.x = this.test.y = 0
    this.app.stage.addChild(this.test)

    this.ws = new WebSocket(Game.wsHost)

    this.ws.onopen = (event) => {
      this.onopen && this.onopen(Game.wsHost)

      setInterval(this.sendControls, 1000 / 60)
    }

    this.ws.onerror = (event) => {
      this.onerror && this.onerror(event.error)
    }

    this.ws.onclose = (event) => {
      if (event.code !== 1000) {
        this.onerror && this.onerror(`Connection abnormally closed with code ${event.code}`)
      }

      this.onclose && this.onclose(event.code)
    }

    this.ws.onmessage = (event) => {
      let msg = JSON.parse(event.data)

      this.onmessage && this.onmessage(msg)

      switch (msg.type) {
        case 'ERROR':
          this.onerror && this.onerror(msg.error)
          dispatch(push('/login'))

          break
        case 'WORLD':
          this.data = msg.data

          let orb = this.data.orbs[Object.keys(this.data.orbs)[0]]

          if (orb) {
            this.test.position.set(orb.x, orb.y)
          }

          break
        default:
          console.log(`Invalid websocket message type: ${msg.type}`)
      }
    }
  }
}