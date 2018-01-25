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