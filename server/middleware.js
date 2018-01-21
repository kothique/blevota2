const express = require('express')
const auth = require('./auth')

module.exports = (app, sessionParser) => {
  app.use(express.json())
  app.use(express.urlencoded({
    extended: true
  }))
  app.use(sessionParser)
  app.use(auth.middleware())
}