const {
  Schema
} = require('./connect')
const ObjectId = Schema.Types.ObjectId

const commentSchema = new Schema({
  content: {
    type: String
  },
  from: {
    type: ObjectId,
    ref: 'users'
  },
  article: {
    type: ObjectId,
    ref: 'articles'
  }
}, {
  versionKey: false,
  //创建time对象，里面包含createdAt(创建时间)，updateAt(更新时间)数据
  timestamps: {
    //默认属性名是createdAt，更改为created
    createdAt: 'created'
  }
})

commentSchema.post('remove', async (doc) => {
  const Article = require('../modules/article')
  const User = require('../modules/user')

  const { from, article } = doc

  await User.updateOne({ _id: from}, { $inc: { commentNum: -1 }})
        .catch(err => {
          console.log(err)
        })

  await Article.updateOne({ _id: article}, { $inc: { commentNum: -1 }})
        .catch(err => {
          console.log(err)
        })


})

module.exports = commentSchema