const Game = require('./game'),
      game = new Game

game.on('tick', ({ frame, timestamp }) => {
  process.send({
    type: 'FRAME',
    frame,
    timestamp
  })
})

game.run(() => {
  console.log(`Worker ${process.pid} is now running simulation`)
})