/**
 * @module server/index
 *
 * @description
 * This is the entry point of the server.
 */

/**
 * The port to listen to. Can be provided from outside by
 * the PORT environment variable.
 *
 * @constant
 * @default 3000
 */
const port = process.env.PORT || 3000

/** Connect to mongo, then do other stuff. */
require('./mongo')(() => {

  /* Run the HTTP server. */
  let app = require('express')(),
      http = require('http').Server(app),
      io = require('socket.io')(http)

  require('./middleware')(app)
  require('./routes')(app)
  require('./io')(io)

  http.listen(port, () => {
    console.log(`Server (pid: ${process.pid}) is now listening on port ${port}`)
  })
})