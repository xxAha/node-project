const mongoose = require('mongoose')
const User = require('../modules/user')
const Article = require('../modules/article')
const Comment = require('../modules/comment')


//获取首页文章列表
exports.getList = async (ctx) => {
  let page = ctx.params.id || 1
  //console.log(page)
  page--
  const maxCount = await Article.find().estimatedDocumentCount()
  
  const articleList = await Article
    .find()
    .sort('-created')
    .skip(5 * page)
    .limit(5)
    .populate({
      path: 'author',
      select: '_id username avatar'
    })
    //.then(data => data)
    //.catch(err => console.log(err))
    
    articleList.forEach(item => {
      const id = mongoose.Types.ObjectId(item._id).toString()
      item.id = id
    });

  await ctx.render('./index.html', {
    session: ctx.session,
    articleList
  })
}
//添加文章页面
exports.addPage = async (ctx) => {
  await ctx.render('add-article.html', {
    session: ctx.session
  })
}
//发表文章
exports.add = async (ctx) => {
  if (ctx.session.isNew) {
    return ctx.body = {
      status: 0,
      msg: '登录后才能发表～'
    }
  }

  const data = ctx.request.body
  data.author = ctx.session.uid

  const art = new Article(data)

  await new Promise((resolve, reject) => {
    art.save(function (err, data) {
      if (err) return reject(err)
      resolve(data)

    })
  }).then(async data => {
    //更新文章计数器
    await User
      .findByIdAndUpdate(ctx.session.uid, {
        $inc: {
          articleNum: 1
        }
      })
      .then()
      .catch(err => {
        console.log(err)
      })

    ctx.body = {
      status: 1,
      msg: '发表成功～'
    }
  }).catch(err => {
    ctx.body = {
      status: 0,
      msg: '发表失败～'
    }
  })


}
//文章详情
exports.detail = async (ctx) => {
  const _id = ctx.params.id
  const article = await Article
    .findById(_id)
    .populate('author', 'username avatar')
    .then(data => data)
  
  const comments = await Comment
    .find({
      article: _id
    })
    .sort('-created')
    .populate('from', 'username avatar')
    .then(data => data)
  
  ctx.render('article.html', {
    session: ctx.session,
    article,
    comments
  })
}
//删除文章
exports.del = async (ctx) => {
  const articleId = ctx.params.id
  const res = {
    state: 1,
    msg: '删除成功～'
  }

  await Article
          .findById(articleId)
          .then(data => data.remove())
          .catch((err) => {
            res = {
              state: 0,
              msg: '删除失败～'
            }
          })
  ctx.body = res

}