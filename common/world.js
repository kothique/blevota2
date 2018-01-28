const defaultInitialState = {
  x: 100,
  y: 100,
  dir: 0,
  v: 0
}

module.exports = class World {
  constructor(initialState = defaultInitialState) {
    this.state = initialState
  }

  applyControls({ mX, mY, lmb, rmb, wheel }) {
    const dx = mX - this.state.x,
          dy = mY - this.state.y

    this.state.dir = Math.atan2(dy, dx)
    this.state.v = lmb ? 0.5 : 0

    return this
  }

  integrate(t, dt) {
    const { x, y, dir, v } = this.state

    this.state.x += Math.cos(dir) * v * dt
    this.state.y += Math.sin(dir) * v * dt

    return this
  }
}