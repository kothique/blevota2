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

const Simulator = require('./simulator')

Simulator.init()