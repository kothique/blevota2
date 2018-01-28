const EventEmitter = require('events')
const present = require('present')

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
      mX: 0,
      mY: 0,
      lmb: false,
      wheel: false,
      rmb: false
    }

    /* Receive controls from the server */
    process.on('message', (msg) => {
      switch (msg.type) {
        case 'CONTROLS':
          const { mX, mY, lmb, wheel, rmb } = msg.controls

          if (typeof mX !== 'undefined')
            this.controls.mX = mX

          if (typeof mY !== 'undefined')
            this.controls.mY = mY
      
          if (typeof lmb !== 'undefined')
            this.controls.lmb = lmb

          if (typeof wheel !== 'undefined')
            this.controls.wheel = wheel

          if (typeof rmb !== 'undefined')
            this.controls.rmb = rmb

          break
      }
    })
  }

  run(callback = null) {
    this.pause = false
    this.begin = present()

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

      let integrated = false
      while (this.accumulator >= this.dt) {
        this.world.applyControls(this.controls)
        this.world.integrate(this.t, this.dt)
        integrated = true

        this.t += this.dt
        this.accumulator -= this.dt
      }

      if (integrated) {
        this.emit('tick', {
          state: this.world.state,
          timestamp: this.t
        })
      }

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