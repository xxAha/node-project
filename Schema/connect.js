const mongoose = require('mongoose')

//连接数据库
const db = mongoose.createConnection('mongodb://localhost:27017/node_project', {useNewUrlParser: true})
//获取Schema对象
const Schema = mongoose.Schema

mongoose.Promise = global.Promise

//监听数据库连接状态
db.on('error', () => {
  console.log('数据库连接失败')
})

db.on('open', () => {
  console.log('数据库node_project连接成功')
})

//向外暴露数据库连接对象和Schema
module.exports = {
  db,
  Schema
}
