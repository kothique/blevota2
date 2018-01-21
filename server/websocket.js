const WebSocket = require('ws')
const pick = require('lodash/pick')
const set = require('lodash/set')

const { ifGuest } = require('./auth')
const World = require('../common/world')
const User = require('./db/user')

const world = new World

const sendWorld = () => JSON.stringify({
  type: 'WORLD',
  data: world.data
})

const sendDiff = (diff) => JSON.stringify({
  type: 'DIFF',
  diff
})

const sendError = (error) => JSON.stringify({
  type: 'ERROR',
  error
})

module.exports = (app, wss, sessionParser) => {
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

  const gameLoopId = setInterval(() => {
    const orb = world.data.orb
    let diff = {}

    wss.clients.forEach((ws) => {
      if (!ws.ready) {
        return
      }

      const { left, right, up, down } = ws.controls

      const speed = 5

      if (left) {
        orb.x -= speed
        set(diff, 'orb.x', orb.x)
      }

      if (right) {
        orb.x += speed
        set(diff, 'orb.x', orb.x)
      }

      if (up) {
        orb.y -= speed
        set(diff, 'orb.y', orb.y)
      }

      if (down) {
        orb.y += speed
        set(diff, 'orb.y', orb.y)
      }
    })

    orb.rotation += 0.01
    if (orb.rotation >= 1) {
      orb.rotation = 0
    }

    // console.log(`World diff: ${JSON.stringify(diff)}`)
    sendDiffToAll(diff)
  }, 1000 / 60)

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

      ws.controls = {
        left: false,
        right: false,
        up: false,
        down: false
      }

      ws.ready = true

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

      ws.send(sendWorld())
    })
  })

  app.ws('/', (ws, req) => {
    ws.on('message', (data) => {
      const msg = JSON.parse(data)
      //console.log(`Message received: ${data}`)

      switch (msg.type) {
        case 'CONTROLS':
          //console.log(`Controls received: ${JSON.stringify(msg.controls)}`)
          ws.controls = pick(msg.controls, ['left', 'right', 'up', 'down'])

          break
      }
    })
  })
}