const { Schema } = require('./connect')

const userSchma = new Schema({
  phone: {
    type: Number,
    required: true
  },
  username: {
    type: String,
    default: 'user' + Date.now()
  },
  password: {
    type: String,
    required: true
  },
}, { versionKey: false})

module.exports = userSchma