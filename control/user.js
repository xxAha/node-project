const {
  db
} = require('../Schema/connect')
const userSchema = require('../Schema/user')
const crypto = require('../util/crypto')

const User = db.model('users', userSchema)

exports.reg = async (ctx) => {
  const regData = ctx.request.body
  
  await new Promise((resolve, reject) => {
    User.find({
      phone: regData.phone
    }, (err, data) => {
      if (err) return reject(err)
      if (data.length !== 0) return resolve('')

      const _user = new User({
        phone: regData.phone,
        username: regData.username,
        password: crypto(regData.pass)
      })
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