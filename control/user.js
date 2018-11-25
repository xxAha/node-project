const User = require('../modules/user')
const Article = require('../modules/article')
const Comment = require('../modules/comment')

const crypto = require('../util/crypto')

//注册
exports.reg = async (ctx) => {
  //获取post请求数据
  const regData = ctx.request.body

  //awati 必须接收一个promise对象
  await new Promise((resolve, reject) => {
    User.find({
      phone: regData.phone
    }, (err, data) => {
      if (err) return reject(err)
      if (data.length !== 0) return resolve('')

      //注册数据
      const _user = new User({
        phone: regData.phone,
        username: regData.username,
        password: crypto(regData.pass)
      })
      //保存到数据库
      _user.save((err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })

  }).then(async data => {
    if (data) {
      await ctx.render('isOk.html', {
        status: '注册成功~'
      })
    } else {
      await ctx.render('isOk.html', {
        status: '手机号码已注册～'
      })
    }
  }).catch(async err => {
    await ctx.render('isOk.html', {
      status: '服务正忙，请稍后再试～'
    })
  })


  // await User.findOne({
  //   phone: regData.phone
  // },async (err, data) => {
  //   if (err) {
  //       await ctx.render('isOk.html', {
  //       status: '服务正忙，请稍后再试～'
  //     })
  //   }
  //   if (data !== null) {
  //       await ctx.render('isOk.html', {
  //       status: '手机号码已注册～'
  //     })
  //   }else {
  //     const _user = new User({
  //       phone: regData.phone,
  //       username: regData.username,
  //       password: regData.pass
  //     })
  //     await _user.save(async (err, data) => {
  //       if (err) {
  //         await ctx.render('isOk.html', {
  //           status: '服务正忙，请稍后再试～'
  //         })
  //       }
  //       await ctx.render('isOk.html', {
  //         status: '注册成功'
  //       })

  //     })




  //   }


  // })
}

//登陆
exports.login = async (ctx) => {
  //获取post请求数据
  const loginData = ctx.request.body

  //awati 必须接收一个promise对象
  await new Promise((resolve, reject) => {
    //查询数据库
    User.find({
      phone: loginData.phone
    }, (err, data) => {
      //错误return
      if (err) return reject(err)
      //没查询到
      if (data.length === 0) return reject('没此用户～')

      //将request的数据密码进行加密比对
      const pwd = crypto(loginData.password)
      if (pwd === data[0].password) {
        resolve(data)
      } else {
        reject('密码错误~')
      }


    })
  }).then(async data => {
    //执行了这个代码，客户端会自动设置cookies
    ctx.cookies.set('phone', data[0].phone, {
      domain: 'localhost', //主机名，cookie作用于哪个地址
      path: '/', //作用于哪个路径，如果是所以路径写'/'，如果只希望在user里面就写'/user'
      maxAge: 36e5, //过期时间
      httpOnly: true, //客户端是否能看到这个cookie，true为不让客户端访问，false是可以,一般设置为true，避免被恶意更改
      overwrite: false, //是否覆盖，一般拿第一次的就可以了，不覆盖
      signed: false, //是否需要签名，这个不需要像session那样给key，cookie会自动添加,默认为true
    })

    ctx.cookies.set('uid', data[0]._id, {
      domain: 'localhost', //主机名，cookie作用于哪个地址
      path: '/', //作用于哪个路径，如果是所以路径写'/'，如果只希望在user里面就写'/user'
      maxAge: 36e5, //过期时间
      httpOnly: true, //客户端是否能看到这个cookie，true为不让客户端访问，false是可以
      overwrite: false, //是否覆盖，一般拿第一次的就可以了，不覆盖
      signed: false, //是否需要签名，这个不需要像session那样给key，cookie会自动添加
    })

    ctx.session = {
      phone: data[0].phone,
      uid: data[0]._id,
      username: data[0].username,
      avatar: data[0].avatar,
      role: data[0].role,
    }

 
    //返回成功状态
    await ctx.render('isOk.html', {
      status: '登录成功~'
    }) 
  }).catch(async err => {
    //返回错误状态
    if (typeof err === 'string') {
      await ctx.render('isOk.html', {
        status: err
      })
    } else {
      await ctx.render('isOk.html', {
        status: '服务器正忙，请稍后再试～'
      })
    } 
  })
}

//查看用户状态 && 保存用户状态
exports.keepLog = async (ctx, next) => {
  if (ctx.session.isNew) {

    if (ctx.cookies.get('uid')) {
      ctx.session = {
        phone: ctx.cookies.get('phone'),
        uid: ctx.cookies.get('uid')
      }
    }

  }
 
  await next()
}

//退出登录
exports.logout = async (ctx) => {
  ctx.session = null
  ctx.cookies.set('phone', null, {
    maxAge: 0
  })
  ctx.cookies.set('uid', null, {
    maxAge: 0
  })
  ctx.redirect('/')
}

//上传头像
exports.upload = async (ctx) => {
  const fileName = ctx.req.file.filename
  ctx.session.avatar = '/img/avatar/' + fileName
  await User.findByIdAndUpdate(ctx.session.uid, {
    $set: {
      avatar: '/img/avatar/' + fileName
    }
  }).then(data => {
   
    ctx.body = {
      status: 1,
      msg: '上传成功～'
    }
  }).catch(err => {
    ctx.body = {
      status: 0,
      msg: '上传失败～'
    }
  })
}