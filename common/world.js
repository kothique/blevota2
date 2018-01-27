const v = 0.5

const defaultInitialState = {
  x: 100,
  y: 100,
  v: {
    x: v,
    y: v
  }
}

module.exports = class World {
  constructor(initialState = defaultInitialState) {
    this.state = initialState
  }

  applyControls({ left, right, up, down }) {
    if (left)
      this.state.v.x = -v
    else if (right)
      this.state.v.x = v
    else
      this.state.v.x = 0

    if (up)
      this.state.v.y = -v
    else if (down)
      this.state.v.y = v
    else
      this.state.v.y = 0

    return this
  }

  integrate(t, dt, controls) {
    const { x, y, v } = this.state

    this.state.x += v.x * dt
    this.state.y += v.y * dt

    return this
  }
}