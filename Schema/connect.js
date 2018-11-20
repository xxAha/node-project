const mongoose = require('mongoose')

const db = mongoose.createConnection('mongodb://localhost:27017/node_project', {useNewUrlParser: true})

const Schema = mongoose.Schema

db.on('error', () => {
  console.log('数据库连接失败')
})

db.on('open', () => {
  console.log('数据库node_project连接成功')
})


module.exports = {
  db,
  Schema
}
