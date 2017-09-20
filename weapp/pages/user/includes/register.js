const app = getApp()
import Md5 from '../../../libs/scripts/md5.min'
import User from './user'

/**
 * 合并用户注册信息
 * @param {[obj]} object 用户所有信息
 */
function megerData({ username, password, userInfo }) {
  const pwd = Md5(password).slice(5, 25)
  const umm = Md5(password).slice(5)
  return Object.assign({}, userInfo, {
    openId: app.globalData.user.openId,
    username: username,
    password: pwd,
    umm: umm
  })
}

/**
 * 验证用户名和密码格式
 * @param {[obj]} fields 用户名和密码
 */
function checkForm(fields) {
  const rules = {
    username: {
      regx: /^[a-zA-Z_0-9]{4,16}$/g,
      text: '用户名必须是4-16字母或数字组成'
    },
    password: {
      regx: /^[a-zA-Z0-9~!@#$%^&*()-_+]{6,18}$/g,
      text: '密码必须是6-18位字符'
    }
  }
  let error = []
  for (let v in fields) {
    if (!rules[v]['regx'].test(fields[v])) {
      error.push(rules[v].text)
    }
  }
  return error
}

/**
 * 用户注册
 * @param {*} fields 用户名和密码
 * @param {*} userInfo 微信用户信息
 * @param {*} object 回调
 */
function register(fields, userInfo, {onSuccess, onError}) {
  const isError = typeof onError === 'function'
  const {username, password} = fields

  // 1. 检测用户微信授权，获取微信信息
  if (!userInfo) {
    return isError && onError(['不授权, 你想咋嘀？'])
  }

  // 2. 验证表单
  const _checkError = checkForm(fields)
  if (_checkError.length > 0) {
    return isError && onError(_checkError)
  }

  // 3. 验证用户名是否存在
  User.getUsers(`?where={"username":"${username}"}&keys=username`).then(user => {
    if (user.length > 0) {
      return isError && onError(['用户名 '+ username +' 已存在'])
    } else {
      // 4. 提交用户信息
      const postData = megerData({username, password, userInfo})
      User.postUser(postData).then(res => {
        return typeof onSuccess === 'function' && onSuccess(res)
      }).catch(error => {
        return isError && onError(['网络错误，注册失败'])
      })
    }
  }).catch(error => {
    return isError && onError(['验证用户数据失败'])
  })
}

module.exports = register