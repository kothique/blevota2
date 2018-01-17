const express = require('express')
const session = require('express-session')
const auth = require('./auth')

module.exports = (app) => {
  app.use(express.json())
  app.use(express.urlencoded({
    extended: true
  }))
  app.use(session({
    secret: 'my wonderful secret',
    resave: false,
    saveUninitialized: false
  }))
  app.use(auth.middleware())
}