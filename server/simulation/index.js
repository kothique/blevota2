const Game = require('./game'),
      game = new Game

game.on('tick', ({ state, timestamp }) => {
  process.send({
    type: 'FRAME',
    state,
    timestamp
  })
})

game.run(() => {
  console.log(`Worker ${process.pid} is now running simulation`)
})