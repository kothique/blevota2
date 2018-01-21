const express = require('express')
const proxy = require('http-proxy-middleware')
const { resolve } = require('path')

let app = express()

app.use(express.static(resolve(__dirname, 'public')))

app.use('/api', proxy({
  target: 'http://localhost:3001',
  changeOrigin: true,
  ws: true,
  pathRewrite: {
    '^/api': ''
  },
  onError: (err, req, res) => {
    console.log(`Error while proxying: ${err.message}`)
  }
}))

app.set('view engine', 'pug')
app.set('views', __dirname)

app.get('/*', (req, res) => {
  res.render('index')
})

app.listen(3000, () => {
  console.log('Server is listening on port 3000')
})