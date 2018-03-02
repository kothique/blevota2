/**
 * @module server/index
 *
 * @description
 * This is the entry point of the server.
 */

const config = require('../server.config')
const httpPort = config.server.port,
      mongoPort = config.db.port

/** Connect to mongo, then do other stuff. */
require('./mongo')()
.then(() => {
  console.log(`Successfully connected to MongoDB on port ${mongoPort}`)

  /* Run the HTTP server. */
  let app = require('express')(),
      http = require('http').Server(app),
      io = require('socket.io')(http)

  require('./middleware')(app)
  require('./routes')(app)
  require('./io')(io)

  http.listen(httpPort, () => {
    console.log(`Server (pid: ${process.pid}) is now listening on port ${httpPort}`)
  })
})
.catch((err) => {
  console.error(`Failed to connect to MongoDB: ${err.message}`)  
})