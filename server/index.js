/**
 * @module server/index
 *
 * @description
 * This is the entry point of the server.
 */

/* Connect to mongo, then do other stuff. */
require('./mongo')(() => {

  /* Run the HTTP server. */
  const port = process.env.PORT || 3000

  let app = require('express')(),
      expressWs = require('express-ws')(app)

  require('./middleware')(app)
  require('./routes')(app)
  require('./ws')(app, expressWs.getWss())

  app.listen(port, () => {
    console.log(`Server (pid: ${process.pid}) is now listening on port ${port}`)
  })
})