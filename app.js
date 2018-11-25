const Koa = require('koa')
const render = require('koa-art-template')
const path = require('path')
const serve = require('koa-static')
const logger = require('koa-logger')
const router = require('./routers/router')
const body = require('koa-body')
const session = require('koa-session')
var compress = require('koa-compress')



//生成koa实例
const app = new Koa()

//session签名
app.keys = ['aha']
//session的配置对象
const CONFIG = {
  key: 'koa:sess', //session id
  maxAge: 86400000, //过期事件
  autoCommit: true,
  overwrite: true, //是否覆盖
  httpOnly: true,
  signed: true, //是否需要签名，类似加密的签名
  rolling: true, //用户每次操作是否刷新session，true刷新，false不刷新(刷新的作用在于不停更新session的到期时间)
  renew: false,
};

//配置日志模块
//app.use(logger())

app.use(compress({
  
 threshold: 2048, //这里的单位是字节，大于2kb就压缩
 flush: require('zlib').Z_SYNC_FLUSH
}))

//配置session
app.use(session(CONFIG, app));

//配置模块，拿post请求数据
app.use(body())

//开放静态资源
app.use(serve(path.join(__dirname, '/public')))
app.use(serve(path.join(__dirname, '/node_modules')))

//配置模板引擎
render(app, {
  root: path.join(__dirname, 'views'),
  extname: '.html',
  debug: process.env.NODE_ENV !== 'production'
})




//配置路由
app.use(router.routes())
app.use(router.allowedMethods())




app.listen(3000, function () {
  console.log('runing')
})

{
  const {
    db
  } = require('./Schema/connect')
  const userSchema = require('./Schema/user')
  const crypto = require('./util/crypto')
  const User = db.model('users', userSchema)

  User
    .find({
      role: 666
    })
    .then(data => {
      
      if (data.length) {
        
        console.log('管理员手机： 13726960641, 密码： admin')
      }else {
        
        //创建管理员
        const admin = new User({
          phone: 13726960641,
          role: 666,
          username: 'admin',
          password: crypto('admin')
        })

        admin
          .save()
          .then(data => {
            console.log('管理员手机： 13726960641, 密码： admin')
          })
          .catch(err => {
            console.log('管理员账号出错～')
          })

      }
    })

}