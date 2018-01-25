const express = require('express')
const morgan = require('morgan')

const auth = require('./auth')

module.exports = (app, sessionParser) => {
  app.use(morgan('combined'))
  app.use(express.json())
  app.use(express.urlencoded({
    extended: true
  }))
  app.use(sessionParser)
  app.use(auth.middleware())
}