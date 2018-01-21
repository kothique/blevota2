import React, { Component } from 'react'
import { connect } from 'react-redux'
import { func } from 'prop-types'
import { push } from 'react-router-redux'
import 'pixi.js'

import '../../common/world'
import './../css/common.css'

class GamePage extends Component {
  static propTypes = {
    dispatch: func.isRequired
  }

  static wsHost = 'ws://localhost:3000/'

  controls: {
    left: false,
    right: false,
    up: false,
    down: false,

    lmb: false,
    rmb: false,
    mmb: false
  }

  ws: null
  world: null
  app: null

  sendControls() {
    ws.send(JSON.stringify(this.controls))

    console.log(`Sent controls: ${this.controls}`)
  }

  componentDidMount() {
    const { dispatch } = this.props

    this.app = new PIXI.Application({
      antialias: true,
      transparent: false,
      resolution: 1
    });

    (it => {
      it.view.style.position = 'absolute'
      it.view.style.display = 'block'
      it.autoResize = true
      it.resize(window.innerWidth, window.innerHeight)
      it.backgroundColor = 0xDDDDDD
    })(this.app.renderer)

    this.test = new PIXI.Graphics()
    this.test.beginFill(0xFF0011)
    this.test.drawCircle(0, 0, 30)
    this.test.endFill()
    this.test.x = this.test.y = 0
    this.app.stage.addChild(this.test)

    document.getElementById('root').appendChild(this.app.view)

    this.ws = new WebSocket(GamePage.wsHost)

    this.ws.onopen = (event) => {
      console.log(`Successfully connected to ${GamePage.wsHost}`)
    }

    this.ws.onmessage = (event) => {
      let msg = JSON.parse(event.data)

      switch (msg.type) {
        case 'TEST':
          this.test.position.set(msg.x, msg.y)

          break
        case 'ERROR':
          alert('ERROR: ', msg.error)
          dispatch(push('/login'))

          break
        case 'WORLD':
          this.world = msg.world
          console.log(`World received: ${this.world}`)

          // re-render

          break
        default:
          console.log(`Invalid websocket message type: ${msg.type}`)
      }
    }
  }

  render() {
    return (
      <div id="game"></div>
    )
  }
}

export default connect(
  (state) => ({
    user: state.user.user
  })
)(GamePage)