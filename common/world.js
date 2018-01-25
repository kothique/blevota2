const set = require('lodash/set')

module.exports = class World {
  constructor() {
    this.previous = {
      state: {
        x: 50,
        y: 50
      }
    }

    this.state = this.previous.state
  }

  integrate(t, dt, controls) {
    this.previous.state = this.state

    let diff = {}

    const { left, right, up, down } = controls,
          v = 0.5

    if (left) {
      this.state.x -= v * dt
      set(diff, 'x', this.state.x)
    }

    if (right) {
      this.state.x += v * dt
      set(diff, 'x', this.state.x)
    }

    if (up) {
      this.state.y -= v * dt
      set(diff, 'y', this.state.y)
    }

    if (down) {
      this.state.y += v * dt
      set(diff, 'y', this.state.y)
    }

    // console.log(`World diff: ${JSON.stringify(diff)}`)
  }

  getState(alpha) {
    return {
      x: this.state.x * alpha + this.previous.state.x * (1 - alpha),
      y: this.state.y * alpha + this.previous.state.y * (1 - alpha)
    }
  }

  // newOrb(user) {
  //   let orb = new Orb({
  //     name: user.username,
  //     x: 50,
  //     y: 50,
  //     r: Math.max(Math.min(user.username.length * 5, 50), 30)
  //   })

  //   this.data.orbs[user._id] = orb
  //   console.log(`New orb created: ${JSON.stringify(orb)}`)

  //   return orb
  // }

  // getOrb(user) {
  //   return this.data.orbs[user._id]
  // }

  // removeOrb(user) {
  //   if (this.data.orbs[user._id]) {
  //     console.log(`Orb removed: ${user._id}`)
  //   }

  //   delete this.data.orbs[user._id]
  // }
}