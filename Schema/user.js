const { Schema } = require('./connect')

const userSchma = new Schema({
  phone: {
    type: Number,
    required: true
  },
  role: {
    type: Number,
    default: 1
  },
  username: {
    type: String,
    default: 'user' + Date.now()
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: '/img/avatar/default.jpg'
  },
  articleNum: {
    type: Number,
    default: 0,
  },
  commentNum: {
    type: Number,
    default: 0
  }
}, { versionKey: false})

module.exports = userSchma