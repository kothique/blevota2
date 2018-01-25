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

const sendWorld = (state) => JSON.stringify({
  type: 'WORLD',
  state
})

const sendDiff = (diff) => JSON.stringify({
  type: 'DIFF',
  diff
})

const sendError = (error) => JSON.stringify({
  type: 'ERROR',
  error
})

module.exports = (app, wss, sessionParser, simulation) => {
  // setInterval(() => {
  //   wss.clients.forEach((ws) => {
  //     if (ws.isAlive === false) {
  //       return ws.terminate()
  //     }

  //     ws.isAlive = false
  //     ws.ping(() => {})
  //   })
  // }, 2000)

  const sendDiffToAll = (diff) => {
    // console.log(`Sent world diff to all clients`)

    wss.clients.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(sendDiff(diff))
      }
    })
  }

  /* Receive a new game state from the simulation process */
  simulation.on('message', (msg) => {
    switch (msg.type) {
      case 'DIFF':
        sendDiffToAll(msg.diff)
        break
    }
  })

  wss.on('connection', (ws) => {
    console.log(`A new connection established`)

    ws.on('close', () => {
      console.log(`Connection closed`)
    })

    sessionParser(ws.upgradeReq, {}, () => {
      // ws.isAlive = true
      // ws.on('pong', (ws) => ws.isAlive = true)

      const userId = ws.upgradeReq.session.userId

      if (!userId) {
        ws.send(sendError('Unauthorized'))
        ws.close()
        return
      }

      /*User.findOne({ _id: ws.upgradeReq.session.userId }, (err, user) => {
        if (err) {
          ws.send(sendError('Internal server error'))
          ws.close()
          return
        }

        let orb = world.newOrb(user)
        ws.user = user
        ws.orb = orb
        sendWorldToAll()
      })*/

      ws.send(sendWorld({ x: 50, y: 50 }))
    })
  })

  app.ws('/', (ws, req) => {
    ws.on('message', (data) => {
      const msg = JSON.parse(data)
      //console.log(`Message received: ${data}`)

      switch (msg.type) {
        case 'CONTROLS':
          //console.log(`Controls received: ${JSON.stringify(msg.controls)}`)

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