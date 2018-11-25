const Router = require('koa-router')
const user = require('../control/user')
const article = require('../control/article')
const comment = require('../control/comment')
const admin = require('../control/admin')
const upload = require('../util/upload')
const router = new Router()

//请求首页
router.get('/', user.keepLog, article.getList)

//请求登录页
router.get('/user/login', async (ctx) => {
  await ctx.render('./login.html')
})

//请求注册页
router.get('/user/reg', async (ctx) => {
  await ctx.render('./register.html')
})



//处理登录
router.post('/user/login', user.login)
//处理注册
router.post('/user/reg', user.reg)
//退出登录
router.get('/user/logout', user.logout)

//请求发表文章页 
router.get('/add-article', user.keepLog, article.addPage)
//发表文章请求
router.post('/add-article', user.keepLog, article.add)
//文章列表分页
router.get('/page/:id', user.keepLog, article.getList)
//文章详情
router.get('/article/:id', user.keepLog, article.detail)

//提交评论内容
router.post('/comment', user.keepLog, comment.submit)

//用户中心页面 
router.get('/admin/:type', user.keepLog, admin.index)
//用户中心上传头像
router.post('/upload', user.keepLog, upload.single('file'), user.upload)
//删除评论
router.del('/comment/:id', user.keepLog, comment.del)
//删除文章
router.del('/article/:id', user.keepLog, article.del)


//404
router.get('*', async (ctx) => {
  await ctx.render('404.html')
})

module.exports = router