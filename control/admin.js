const User = require('../modules/user')
const Article = require('../modules/article')
const Comment = require('../modules/comment')

const fs = require('fs')
const path = require('path')


exports.index = async (ctx) => {
  if (ctx.session.isNew) return await ctx.render('index.html')
  const type = ctx.params.type
  // let html
  //   switch (type) {
  //     case 'user':
  //     console.log('xxx')
  //       html = 'admin-center.html'
  //       break;
  //       //await ctx.render('admin/admin-seting.html')
  //     case 'set':
  //       html = 'admin-seting.html'
  //       break;
  //     case 'article':
  //       html = 'admin-article.html'
  //       break;
  //     case 'comment':
  //       html = 'admin-comment.html'
  //       break;
  //   }

  // const userData = await User
  //         .findById(ctx.session.uid)
  //         .catch(err => {
  //           console.log(err)
  //         })
 

  let fileArr = await new Promise((resolve, reject) => {
    fs.readdir(path.join(__dirname, '../views/admin'), function (err, data) {
      if (err) return reject(err)
      resolve(data)
    })
  })
  let flag = false
  fileArr.forEach(v => {
    const name = v.replace(/^(admin-)|(\.html)$/g, '')
    if (name === type) {
      flag = true
    }

    
  });
  if (flag) {
    if (type === 'comment') {
      const id = ctx.session.uid
 
      const comList = await Comment
        .find({
          from: id
        })
        .populate('article', 'title')
        .sort('-created')
      return ctx.render(`admin/admin-${type}`, {
        session: ctx.session,
        comList
      })

    }else if (type === 'article') {
      const id = ctx.session.uid
 
      const artList = await Article
        .find({
          author: id
        })
       
        .sort('-created')
        
      return ctx.render(`admin/admin-${type}`, {
        session: ctx.session,
        artList
      })
      
    }

    ctx.render(`admin/admin-${type}`, {
      session: ctx.session,
    })
  }else {
    ctx.render('404.html')
  }



  //console.log(fileArr)
  





  

  // await ctx.render(`admin/${html}`, {
  //   session: ctx.session
  // })
}