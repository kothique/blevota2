const World = require('./common/world')

const w = new World
w.newOrb('player1')
console.log(JSON.stringify(w.state))
w.applyControls('player1', { mX: 200, mY: 200, lmb: true, rmb: false, wheel: false })
console.log(JSON.stringify(w.state))

const dt = 0.01
let t = 0
const loop = () => {
  w.integrate(t, dt)
  console.log(t + 's: ' + JSON.stringify(w.state))
  t += dt

  setTimeout(loop)
}

loop()
