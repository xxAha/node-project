const {
  db
} = require('../Schema/connect')

//users集合
const userSchema = require('../Schema/user')
const User = db.model('users', userSchema)

module.exports = User