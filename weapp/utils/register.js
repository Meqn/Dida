const app = getApp()
import Md5 from '../libs/md5.min'
import { getUsers, addUser, saveLocalUser } from './user'

// 合并用户注册信息
function megerData({ name, pwd, userInfo }) {
  const password = Md5(pwd).slice(5, 25)
  const umm = Md5(pwd).slice(5)
  let ret = Object.assign({}, userInfo, {
    openId: app.globalData.user.openId,
    username: name,
    password,
    umm
  })
  return ret;
}

// 验证注册表单
function checkForm(fields) {
  var rules = {
    username: {
      regx: /^[a-zA-Z_0-9]{4,16}$/g,
      tip: '用户名必须是4-16字母或数字组成'
    },
    password: {
      regx: /^[a-zA-Z0-9~!@#$%^&*()-_+]{6,18}$/g,
      tip: '密码必须是6-18位字符'
    }
  }
  var error = []
  for (let v in fields) {
    if (!rules[v]['regx'].test(fields[v])) {
      error.push(rules[v].tip)
    }
  }
  return error
}
// 检测用户名
function checkUserName(username, { success = null, fail = null }) {
  getUsers({
    where: { username: username },
    keys: 'username'
  }).then(res => {
    if (res.statusCode === 200) {
      typeof success === 'function' && success(res.data)
    } else {
      console.error('获取用户失败 : ', res)
      typeof fail === 'function' && fail('网络繁忙，请稍后再试')
    }
  })
}
// 提交用户信息
function postUser(data = {}, { success = null, fail = null }) {
  addUser({
    data,
    success(res) {
      console.log('注册成功 ： ', res)
      saveLocalUser(res.data)
      typeof success === 'function' && success(res.data)
    },
    fail(error) {
      console.error('注册失败 : ', error)
      typeof fail === 'function' && fail(error)
    }
  })
}


function submit(fields, userInfo, {onSuccess = null, onError = null}) {
  // 1. 检测用户微信授权，获取微信信息
  if (!userInfo) {
    return typeof onError === 'function' && onError(['不授权, 你想咋嘀？'])
  }
  // 2. 验证表单
  const _check = checkForm(fields)
  if (_check.length > 0) {
    return typeof onError === 'function' && onError(_check)
  }
  // 3. 验证用户名
  checkUserName(fields.username, {
    success(res) {
      if (res.results.length > 0) {
        return typeof onError === 'function' && onError(['用户名: ' + fields.username + ' 已存在'])
      } else {
        // 4. 提交用户信息
        const userData = megerData({
          name: fields.username,
          pwd: fields.password,
          userInfo
        })
        postUser(userData, {
          success(res) {
            typeof onSuccess === 'function' && onSuccess(res)
          },
          fail(error) {
            typeof onError === 'function' && onError(['网络繁忙，注册失败'])
          }
        })
      }
    },
    fail(error) {
      typeof onError === 'function' && onError([error])
    }
  })
}

module.exports = submit