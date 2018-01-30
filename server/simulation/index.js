/**
 * @module server/simulation/index
 *
 * @description
 * This is the entry point of the simulation program.
 * It communicates with the server through IPC.
 */

const Simulator = require('./simulator'),
      simulator = new Simulator

process.on('message', (msg) => {
  switch (msg.type) {
    case 'NEW_ORB':
      simulator.newOrb(msg.id)
      break
    case 'START':
      simulator.start(() => {
        console.log(`Process ${process.pid} is now running simulation`)
      })
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