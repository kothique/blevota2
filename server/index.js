require('./mongo')(() => {
  /* Connected to mongo. Now do other stuff */

  {
    /* Run the http-ws server */

    const port = process.env.PORT || 3001

    let app = require('express')(),
        expressWs = require('express-ws')(app)

    let sessionParser = require('express-session')({
      secret: 'my wonderful secret',
      resave: false,
      saveUninitialized: false
    })

    require('./middleware')(app, sessionParser)
    require('./websocket')(app, expressWs.getWss(), sessionParser)
    require('./routes')(app)

    app.listen(3001, () => {
      console.log(`Worker ${process.pid} is now listening on port ${port}`)
    })
  }

  {
    /* Run the game simulation */

    const simulation = require('child_process').fork('./server/simulation')
  }
})