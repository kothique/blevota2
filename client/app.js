const express = require('express')
const proxy = require('http-proxy-middleware')
const path = require('path')

// @flow
let app = express()

app.use(express.static(path.resolve(__dirname, 'public')))

app.use('/api', proxy({
  target: 'http://localhost:3001',
  changeOrigin: true,
  ws: true,
  pathRewrite: {
    '^/api': '/'
  }
}))

app.set('view engine', 'pug')
app.set('views', __dirname)

app.get('/', (req: Object, res: Object): void => {
  res.render('index')
})

app.listen(3000, (): void => {
  console.log('Server is listening on port 3000')
})