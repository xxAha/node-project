const Koa = require('koa')
const render = require('koa-art-template')
const path = require('path')
const serve = require('koa-static')
const logger = require('koa-logger')
const router = require('./routers')
const body = require('koa-body')




const app = new Koa()
app.use(logger())

app.use(body())

app.use(serve(path.join(__dirname, '/public')))
app.use(serve(path.join(__dirname, '/node_modules')))

render(app, {
  root: path.join(__dirname, 'views'),
  extname: '.html',
  debug: process.env.NODE_ENV !== 'production'
})

app.use(router.routes())
app.use(router.allowedMethods())




app.listen(3000, function () {
  console.log('runing')
})