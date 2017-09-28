// 基础 URL
const weBase = 'https://api.jiabe.com/weapp'
const leanBase = 'https://api.leancloud.cn/1.1'
const leanUrl = leanBase + '/classes'
const leanBatch = '/1.1/classes'

module.exports = {
  weapp: {
    user: weBase + '/user',
    notice: weBase + '/notice'
  },
  batch: {
    url: leanBase + '/batch',
    todo: leanBatch + '/Todo',
    todoFollow: leanBatch + '/TodoFollow'
  },
  user: {
    user: leanBase + '/users',
    login: leanBase + '/login'
  },
  todo: {
    todo: leanUrl + '/Todo',
    class: leanUrl + '/TodoClass',
    follow: leanUrl + '/TodoFollow'
  }
}