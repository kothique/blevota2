/**
 * @module server/simulation/index
 *
 * @description
 * This is the entry point of the simulation program.
 * It communicates with the server through IPC.
 */

/** Open inspector if not in production mode */
if (process.env.NODE_ENV !== 'production') {
  const inspector = require('inspector')

  inspector.open(Number(process.env.INSPECTOR_PORT), null)
}

const Simulator = require('./simulator'),
      simulator = new Simulator

simulator.on('start', () => {
  console.log(`Simulation started (PID: ${process.pid})`)
})

simulator.on('stop', () => {
  console.log(`Simulation stopped (PID: ${process.pid})`)
})

process.on('message', (msg) => {
  switch (msg.type) {
    case 'NEW_ORB':
      simulator.newOrb(msg.id)
      break
    case 'REMOVE_ORB':
      simulator.removeOrb(msg.id)
      break
    case 'START':
      simulator.start()
      break
    case 'STOP':
      simulator.stop()
      break
    case 'CONTROLS':
      simulator.setControls(msg.id, msg.controls)
      break
  }
})

simulator.on('frame', (frame) => {
  process.send({
    type: 'FRAME',
    frame
  })
})