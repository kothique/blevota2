const express = require('express')
const morgan = require('morgan')

const auth = require('./auth')

module.exports = (app) => {
  app.use(morgan('dev'))
  app.use(express.static('dist'))
  app.use(express.json())
  app.use(express.urlencoded({
    extended: true
  }))
  app.use(auth.expressMiddleware())
}
