const {
  Schema
} = require('./connect')
const ObjectId = Schema.Types.ObjectId

const articleSchma = new Schema({
  title: {
    type: String
  },
  tip: {
    type: String
  },
  content: {
    type: String
  },
  commentNum: {
    type: Number,
    default: 0
  },
  author: {
    type: ObjectId,
    ref: 'users'

  }
}, {
  versionKey: false,
  //创建time对象，里面包含createdAt(创建时间)，updateAt(更新时间)数据
  timestamps: {
    //默认属性名是createdAt，更改为created
    createdAt: 'created'
  }
})

articleSchma.post('remove', async (doc) => {
  const Comment = require('../modules/comment')
  const User = require('../modules/user')

  const {
    _id: artId,
    author
  } = doc


  await User
    .findByIdAndUpdate(author, {
      $inc: {
        articleNum: -1
      }
    })
    .catch(err => {
      console.log(err)
    })

  await Comment.find({
    article: artId
  }).then(data => {
    data.forEach(item => item.remove())
  })



})

module.exports = articleSchma