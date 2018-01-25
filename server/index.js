const cluster = require('cluster')

const port = process.env.PORT || 3001

require('./mongo')(() => {
  if (cluster.isMaster) {
    const server = cluster.fork({
      WORKER_TYPE: 'SERVER'
    })

    const simulation = cluster.fork({
      WORKER_TYPE: 'SIMULATION'
    })

    cluster.on('message', (worker, msg) => {
      switch (msg.type) {
        case 'DIFF':
          server.send({
            type: 'DIFF',
            diff: msg.diff
          })
          break
      }
    })
  } else if (cluster.isWorker) {
    if (process.env.WORKER_TYPE === 'SERVER') {
      let app = require('express')(),
          expressWs = require('express-ws')(app)

      let sessionParser = require('express-session')({
        secret: 'my wonderful secret',
        resave: false,
        saveUninitialized: false
      })

      require('./middleware')(app, sessionParser)
      require('./websocket')(app, expressWs.getWss(), sessionParser)
      require('./routes')(app)

      app.listen(3001, () => {
        console.log(`Worker ${process.pid} is now listening on port ${port}`)
      })
    } else if (process.env.WORKER_TYPE === 'SIMULATION') {
      const Game = require('./game'),
            game = new Game

      game.on('tick', (state) => {
        process.send({
          type: 'DIFF',
          diff: state
        })
      })

      game.run(() => {
        console.log(`Worker ${process.pid} is now running simulation`)
      })
    }
  }
})