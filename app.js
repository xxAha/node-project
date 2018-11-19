const Koa = require('koa')
const Router = require('koa-router')
const render = require('koa-art-template')
const path = require('path')
const serve = require('koa-static')



const app = new Koa()
const router = new Router()
app.use(router.routes())
app.use(router.allowedMethods())
app.use(serve(__dirname + '/public'))
app.use(serve(__dirname + '/node_modules'))

render(app, {
  root: path.join(__dirname, 'views'),
  extname: '.html',
  debug: process.env.NODE_ENV !== 'production'
});

router.get('/', async (ctx) => {
  await ctx.render('./index.html')
})

router.get('/user/login', async (ctx) => {
  await ctx.render('./login.html')
})

router.get('/user/reg', async (ctx) => {
  await ctx.render('./register.html')
})


app.listen(3000, function () {
  console.log('runing')
})