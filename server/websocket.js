const { ifGuest } = require('./auth')

module.exports = (app, wss) => {
  wss.on('connection', (ws, req) => {
    console.log(`A new connection established`)

    /*if (!req.auth.user) {
      ws.send(JSON.stringify({
        type: 'ERROR',
        error: 'Unauthorized'
      }))
      ws.close()
      console.log(`Connection closed`)
    }*/

    const msg = {
      type: 'TEST',
      x: 50,
      y: 100
    }

    ws.send(JSON.stringify(msg))
    console.log(`Message sent: ${JSON.stringify(msg)}`)

    setTimeout(() => {
      ws.send(JSON.stringify({ type: 'TEST', x: 100, y: 200 }))
    }, 1000)
  })

  app.ws('/', ifGuest({ error: true}), (ws, req) => {
    ws.on('message', (data) => {
      console.log(`Message received: ${JSON.stringify(data)}`)

      switch (data.type) {
        case 'CONTROLS':
          console.log(`Controls received: ${JSON.stringify(data.controls)}`)

          break
      }
    })
  })
}