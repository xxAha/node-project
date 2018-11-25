const {
  db
} = require('../Schema/connect')
//articles集合
const articleSchema = require('../Schema/article')
const Article = db.model('articles', articleSchema)

module.exports = Article