const app = getApp()
import md5 from '../libs/md5.min'
import { xhr, setACL } from './util'

// 该微信用户已存在，直接登录
function autoLogin(username = '', password = '') {
  return new Promise((resolve, reject) => {
      xhr({
      url: '/login?username='+ username + '&password=' + password.slice(0, 20),
      success(res) {
        console.log('用户登录成功：', res)
        saveLocalUser(res.data)
        resolve(res.data)
      },
      fail(error) {
        console.error('登录失败: ', error)
        app.globalData.user = null
        wx.removeStorage({key: 'user'})
        reject(error)
      }
    })
  })
}
// 将用户登录后的信息保存到本地
const saveLocalUser = function (data) {
  app.globalData.user = data
  wx.setStorage({
    key: 'user',
    data: data
  })
}


// 用户微信登录，并获取 openid
const getWxUser = function () {
  return new Promise((resolve, reject) => {
     wx.login({
      success(res) {
        console.log('微信登录 ： ', res)
        if (res.code) {
          wx.request({
            url: 'https://api.jiabe.com/weapp/user',
            data: {
              code: res.code
            },
            success(user) {
              console.log('获取openId ： ', user)
              app.globalData.user = {
                openId: user.data.openid
              }
              resolve(user.data)
            },
            fail(error) {
              console.error('获取openId : ', error)
              reject(error)
            }
          })
        } else {
          console.error('获取微信code : ', error)
          reject(res)
        }
      },
      fail(error) {
        console.error('微信登录 : ', error)
        reject(error)
      }
    }) 
  })
}


/**
 * 检测 微信用户是否已经存在
 *  存在 -> 自动登录
 *  不存在 -> 去注册
 */
const checkUser = function ({register, success, fail}) {
  getWxUser().then(data => {
    console.log(' .... : ',data)
    getUsers({
      where: {openId: data['openid']},
      keys: 'username,umm'
    }).then(user => {
      console.log('app.globalData.user : ', app.globalData.user)
      if(user.statusCode === 200) {
        let _user = user.data.results
        if (_user.length > 0) {
          // 已存在，直接登录
          autoLogin(_user[0].username, _user[0].umm).then(res => {
            typeof success === 'function' && success(res)
          }).catch(error => {
            console.error('自动登录失败 : ', error)
            typeof fail === 'function' && fail(error)
          })
        } else {
          // 注册
          /* wx.navigateTo({
            url: '/pages/user/register/register',
          }) */
          typeof register === 'function' && register()
        }
      } else {
        console.error('获取用户失败 ', user)
      }
    }).catch(error => {
      console.error('获取用户 error ', error)
    })
  }).catch(error => {
    console.error('获取微信 openid error', error)
  })
}

// 获取用户微信信息
const getUserInfo = function() {
  return new Promise((resolve, reject) => {
    wx.getUserInfo({
      success(res) {
        console.log('getUserInfo : ', res)
        resolve(res)
      },
      fail(error) {
        reject(error)
      }
    })
  })
}

// 获取符合条件的所有用户 (masterKey 查询)
const getUsers = function ({where, keys}) {
  let _where = (where && typeof where === 'object') ? '?where='+ encodeURIComponent(JSON.stringify(where)) : ''
  let _keys = (keys && typeof keys === 'string') ? (_where ? '&' : '?') + 'keys=' + encodeURIComponent(keys) : ''
  console.log('/users' + _where + _keys)
  return new Promise((resolve, reject) => {
    xhr({
      url: '/users' + _where + _keys,
      lcSignType: 'master',
      success: function(res) {
        console.log('获取所有用户：', res)
        resolve(res)
      },
      fail: function(error) {
        console.error('获取所有用户：', error)
        reject(error)
      }
    })
  })
}

// 新建用户
const addUser = function ({data = {}, success, fail}) {
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
