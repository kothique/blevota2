/**
 * @module server/index
 *
 * @description
 * This is the entry point of the server.
 */

/* Connect to mongo, then do other stuff. */
require('./mongo')(() => {

  /* Run the HTTP server. */
  const port = process.env.PORT || 3001

  let app = require('express')(),
      expressWs = require('express-ws')(app)

  let sessionParser = require('express-session')({
    secret: 'my wonderful secret',
    resave: false,
    saveUninitialized: false
  })

  require('./middleware')(app, sessionParser)
  require('./routes')(app)
  require('./ws')(app, expressWs.getWss(), sessionParser)

  app.listen(3001, () => {
    console.log(`Server (pid: ${process.pid}) is now listening on port ${port}`)
  })
})