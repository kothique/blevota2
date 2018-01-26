const WebSocket = require('ws')
const pick = require('lodash/pick')
const set = require('lodash/set')

const { ifGuest } = require('./auth')
const User = require('./db/user')

let controls = {
  left: false,
  right: false,
  up: false,
  down: false
}

const sendFrame = ({ frame, timestamp }) => JSON.stringify({
  type: 'FRAME',
  frame,
  timestamp
})

const sendError = (error) => JSON.stringify({
  type: 'ERROR',
  error
})

module.exports = (app, wss, sessionParser, simulation) => {
  const sendFrameToAll = (data) => {
    // console.log(`Sent world diff to all clients`)

    wss.clients.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(sendFrame(data))
      }
    })
  }

  /* Receive a new frame from the simulation process */
  simulation.on('message', (msg) => {
    switch (msg.type) {
      case 'FRAME':
        sendFrameToAll({
          frame: msg.frame,
          timestamp: msg.timestamp
        })
        break
    }
  })

  wss.on('connection', (ws) => {
    console.log(`A new connection established`)

    ws.on('close', () => {
      console.log(`Connection closed`)
    })

    /* Parse session and check authorization */
    sessionParser(ws.upgradeReq, {}, () => {
      const userId = ws.upgradeReq.session.userId

      if (!userId) {
        ws.send(sendError('Unauthorized'))
        ws.close()
        return
      }
    })
  })

  app.ws('/', (ws, req) => {
    ws.on('message', (data) => {
      const msg = JSON.parse(data)
      //console.log(`Message received: ${data}`)

      switch (msg.type) {
        case 'CONTROLS':
          // console.log(`Controls received: ${JSON.stringify(msg.controls)}`)

          /* Send controls to the simulation process */
          simulation.send({
            type: 'CONTROLS',
            controls: pick(msg.controls, ['left', 'right', 'up', 'down'])
          })
          break
      }
    })
  })
}