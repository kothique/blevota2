/**
 * @module server/simulation/index
 *
 * @description
 * This is the entry point of the simulation program.
 * It communicates with the server through IPC.
 */

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