const EventEmitter = require('events')

const World = require('../../common/world')

module.exports = class Game extends EventEmitter {
  constructor(options = {}) {
    super()

    this.world = options.world || new World
    this.t = options.t || 0
    this.dt = options.dt || 1000 / 120
    this.accumulator = 0

    this.pause = false

    this.controls = {
      left: false,
      right: false,
      up: false,
      down: false
    }

    /* Receive controls from the server */
    process.on('message', (msg) => {
      switch (msg.type) {
        case 'CONTROLS':
          this.controls = msg.controls
          break
      }
    })
  }

  run(callback = null) {
    this.pause = false

    callback && callback()

    let currentTime = Date.now()

    const loop = () => {
      let newTime = Date.now(),
          frameTime = newTime - currentTime
      
      if (frameTime > 1000 / 60) {
        frameTime = 1000 / 60
      }
      currentTime = newTime

      this.accumulator += frameTime

      while (this.accumulator >= this.dt) {
        this.world.integrate(this.t, this.dt, this.controls)

        this.t += this.dt
        this.accumulator -= this.dt
      }

      //const alpha = this.accumulator / this.dt
      this.emit('tick', this.world.state)//this.world.getState(alpha))

      if (Date.now() - currentTime < this.dt - 4) {
        setTimeout(loop)
      } else {
        setImmediate(loop)
      }
    }

    loop()
  }

  stop() {
    this.pause = true

    console.log(`Simulation paused`)
  }
}