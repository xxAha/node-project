const Router = require('koa-router')
const router = new Router()
const user = require('../control/user')

router.get('/', async (ctx) => {
  await ctx.render('./index.html')
})

router.get('/user/login', async (ctx) => {
  await ctx.render('./login.html')
})

router.get('/user/reg', async (ctx) => {
  await ctx.render('./register.html')
})


router.post('/user/login', async (ctx) => {
  console.log(ctx.request.body)
})

router.post('/user/reg', user.reg)

module.exports = router