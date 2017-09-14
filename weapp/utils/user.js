const app = getApp()
import md5 from '../libs/md5.min'
import { xhr, setACL, setError } from './util'

// 该微信用户已存在，直接登录
function autoLogin(username = '', password = '') {
  return new Promise((resolve, reject) => {
    xhr({
      url: '/login?username=' + username + '&password=' + password.slice(0, 20),
      success(res) {
        saveLocalUser(res.data)
        resolve(res.data)
      },
      fail(error) {
        app.globalData.user = null
        wx.removeStorage({ key: 'user' })
        reject(setError(error, '登录失败!'))
      }
    })
  })
}
/**
 * [将用户登录后的信息保存到本地]
 * @param {*} data 数据
 */
const saveLocalUser = function (data) {
  app.globalData.user = Object.assign({}, data, {updated: false})
  wx.setStorage({
    key: 'user',
    data: app.globalData.user
  })
}


/**
 * 用户微信登录，并获取 openid
 */
const getWechatUser = function () {
  return new Promise((resolve, reject) => {
    wx.login({
      success(res) {
        if (res.code) {
          wx.request({
            url: 'https://api.jiabe.com/weapp/user',
            data: {
              code: res.code
            },
            success(user) {
              app.globalData.user = {
                openId: user.data.openid
              }
              resolve(user.data)
            },
            fail(error) {
              reject(setError(error, '获取用户openId失败!'))
            }
          })
        } else {
          reject(setError(error, '获取用户登录状态失败!'))
        }
      },
      fail(error) {
        reject(setError(error, '微信登录失败!'))
      }
    })
  })
}

/**
 * 检测微信用户是否已经存在 [存在 -> 自动登录; 不存在 -> 去注册]
 * @param  {[fn]} onSign    [未注册回调]
 * @param  {[fn]} onSuccess [登录成功回调]
 * @param  {[fn]} onError   [操作失败回调]
 */
const checkUser = function ({ onSign = null, onSuccess = null, onError = null }) {
  getWechatUser().then(data => {
    const condition = `?where={"openId":"${data['openid']}"}&keys=username,umm`
    getUsers(condition).then(user => {
      console.log('app.globalData.user : ', app.globalData.user)
      if (user.statusCode === 200) {
        let _user = user.data.results
        if (_user.length > 0) {
          // 已存在，直接登录
          autoLogin(_user[0].username, _user[0].umm).then(res => {
            typeof onSuccess === 'function' && onSuccess(res)
          }).catch(error => {
            typeof onError === 'function' && onError(error)
          })
        } else {
          // 注册
          if (onSign) {
            typeof onSign === 'function' && onSign()
          } else {
            wx.navigateTo({
              url: '/pages/user/register/register',
            })
          }
        }
      }
    }).catch(error => {
      typeof onError === 'function' && onError(error)
    })
  }).catch((error) => {
    typeof onError === 'function' && onError(error)
  })
}

// 获取用户微信信息
const getUserInfo = function () {
  return new Promise((resolve, reject) => {
    wx.getUserInfo({
      success(res) {
        resolve(res)
      },
      fail(error) {
        reject(setError(error, '微信信息授权失败!'))
      }
    })
  })
}

/**
 * 获取符合条件的所有用户
 * @param  {[string]} where     [查询条件]
 */
const getUsers = function (condition) {
  return new Promise((resolve, reject) => {
    xhr({
      url: '/users' + condition,
      lcSignType: 'master',
      success(res) {
        resolve(res)
      },
      fail(error) {
        reject(setError(error, '获取用户失败'))
      }
    })
  })
}

// 新建用户
const addUser = function ({ data = {}, success, fail }) {
  xhr({
    url: '/users',
    method: 'POST',
    data,
    success,
    fail
  })
}
// 获取用户信息
const getUser = function ({ id, success, fail }) {
  xhr({
    url: '/users/' + id,
    success,
    fail
  })
}
// 更新用户信息
const updateUser = function ({ id, data, success, fail }) {
  xhr({
    url: '/users/' + id,
    method: 'PUT',
    header: {
      'X-LC-Session': app.globalData.user['sessionToken']
    },
    data,
    success,
    fail
  })
}


module.exports = {
  getUserInfo,
  checkUser,
  getUsers,
  getUser,
  updateUser,
  addUser,
  saveLocalUser
}
