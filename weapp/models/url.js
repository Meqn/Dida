// 基础 URL
const weBase = 'https://api.jiabe.com/weapp'
const leanBase = 'https://api.leancloud.cn/1.1'
const leanUrl = leanBase + '/classes'


module.exports = {
  weapp: {
    user: weBase + '/user',
    notice: weBase + '/notice'
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