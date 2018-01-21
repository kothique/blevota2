const { ifGuest } = require('./auth')
const { World } = require('../common/world')
const User = require('./db/user')

let world = new World

const sendWorld = () => JSON.stringify({
  type: 'WORLD',
  data: world.data
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

  const sendWorldToAll = () => {
    console.log(`World: ${JSON.stringify(world)}`)

    wss.clients.forEach(ws => {
      ws.send(sendWorld())
    })
  }

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

      User.findOne({ _id: ws.upgradeReq.session.userId }, (err, user) => {
        if (err) {
          ws.send(sendError('Internal server error'))
          ws.close()
          return
        }

        let orb = world.newOrb(user)
        ws.user = user
        ws.orb = orb
        sendWorldToAll()
      })
    })
  })

  app.ws('/', (ws, req) => {
    ws.on('message', (data) => {
      const msg = JSON.parse(data)
      console.log(`Message received: ${data}`)

      switch (msg.type) {
        case 'CONTROLS':
          console.log(`Controls received: ${JSON.stringify(msg.controls)}`)

          let changed = false

          if (msg.controls.ArrowLeft) {
            ws.orb.x -= 10
            changed = true
          }

          if (msg.controls.ArrowRight) {
            ws.orb.x += 10
            changed = true
          }

          if (msg.controls.ArrowUp) {
            ws.orb.y -= 10
            changed = true
          }

          if (msg.controls.ArrowDown) {
            ws.orb.y += 10
            changed = true
          }

          if (changed) {          
            sendWorldToAll()
          }

          break
      }
    })
  })
}