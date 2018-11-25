const User = require('../modules/user')
const Article = require('../modules/article')
const Comment = require('../modules/comment')

//提交评论
exports.submit = async (ctx) => {
  if (ctx.session.isNew) return ctx.body = {
    status: 0,
    msg: '请登录后再评论～'
  }

  const postData = ctx.request.body
  postData.from = ctx.session.uid

  const comment = new Comment(postData)

  await comment
    .save()
    .then(async data => {
      //更新article计数器
      await Article
        .findByIdAndUpdate(postData.article, {
          $inc: {
            commentNum: 1
          }
        })
        .then()
        .catch(err => {
          console.log(err)
        })

      //更新user评论计数器
      const result = await User
        .findByIdAndUpdate(ctx.session.uid, {
          //原子操作
          $inc: {
            commentNum: 1
          }
        })
        .catch(err => {
          console.log(err)
        })

      ctx.body = {
        status: 1,
        msg: '发表成功'
      }

    })
    .catch(err => {
      ctx.body = {
        status: 0,
        msg: '服务器正忙,请稍后再试～'
      }
    })


}

exports.userComList = async (ctx) => {
  const id = ctx.session.uid

  const comList = await Comment
    .find({
      from: id
    })
    .populate('article', 'title')

  ctx.body = {
    code: 0,
    count: comList.length,
    data: comList
  }
}

exports.del = async (ctx) => {

  //const commentId = ctx.params.id

  // let articleId, uid

  // await Comment
  //   .findById(commentId)
  //   .then(data => {
  //     articleId = data.article
  //     uid = data.from
  //   })
  // await Comment.deleteOne({
  //   _id: commentId
  // })
  // await Article.findByIdAndUpdate(articleId, {
  //   $inc: {
  //     commentNum: -1
  //   }
  // })
  // await User.findByIdAndUpdate(uid, {
  //   $inc: {
  //     commentNum: -1
  //   }
  // })
  const commentId = ctx.params.id
  let res = {
    state: 1,
    msg: '删除成功～'
  }
  await Comment
          .findById(commentId)
          .then(data => data.remove())
          .catch(err => {
            res = {
              state: 0,
              msg: '删除失败～'
            }
          })
  
  ctx.body = res

}