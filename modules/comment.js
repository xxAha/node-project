const {
  db
} = require('../Schema/connect')

//comments集合
const commentSchema = require('../Schema/comment')
const Comment = db.model('comments', commentSchema)

module.exports = Comment