const app = getApp()
import Util from '../../../utils/util'
import User from '../../../models/user'


/**
 * 保存用户信息到本地
 * @param {[obj]} data 用户信息
 */
function saveUserToLocal(data) {
  app.globalData.user = data
  wx.setStorage({
    key: 'user',
    data: data
  })
}

/**
 * 微信登录，获取用户openid
 */
function wxLogin() {
  return new Promise((resolve, reject) => {
    wx.login({
      success(res) {
        if (res.code) {
          User.getUserId(res.code, {
            success(user) {
              app.globalData.user = { openId: user.data.openid }
              resolve(user.data)
            },
            fail(error) {
              reject(Util.resetError(error, '获取用户openId失败!'))
            }
          })
        } else {
          reject(Util.resetError(res, '获取用户登录状态失败!'))
        }
      },
      fail(error) {
        reject(Util.resetError(error, '微信登录失败!'))
      }
    })
  })
}

/**
 * 用户登录
 * @param {[obj]} data 用户名和密码
 */
function userLogin(data) {
  return new Promise((resolve, reject) => {
    User.login(data, {
      success(res) {
        if (res.statusCode === 200) {
          const _result = Object.assign({}, res.data, {updated: false})
          saveUserToLocal(_result)
          resolve(_result)
        } else {
          reject(Util.resetError(res, '用户信息不对，登录失败'))
        }
      },
      fail(error) {
        reject(Util.resetError(error, '网络错误，登录失败'))
      }
    })
  })
}

/**
 * 获取用户列表
 * @param {[str]} condition 筛选条件
 */
function getUsers(condition) {
  return new Promise((resolve, reject) => {
    User.getUsers(condition, {
      success(res) {
        if (res.statusCode === 200) {
          resolve(res.data.results)
        } else {
          reject(Util.resetError(res, '获取用户列表失败'))
        }
      },
      fail(error) {
        reject(Util.resetError(error, '网络错误'))
      }
    })
  })
}

/**
 * 用户是否存在，存在则自动登录，不存在则注册
 * @param {[obj]} object 回调 
 */
function checkUser({ onSign = null, onSuccess = null, onError = null }) {
  wxLogin().then(data => {
    getUsers(`?where={"openId":"${data['openid']}"}&keys=username,umm`).then(user => {
      if (user.length > 0) {
        userLogin({ username: user[0].username, password: user[0].umm }).then(res => {
          typeof onSuccess === 'function' && onSuccess(res)
        })
      } else {
        if (typeof onSign === 'function') {
          onSign()
        } else {
          wx.navigateTo({ url: '/pages/user/register/register' })
        }
      }
    })
  }).catch(error => {
    typeof onError === 'function' && onError(error)
  })
}

/**
 * 创建新用户
 * @param {[obj]} data 用户数据
 */
function postUser(data) {
  return new Promise((resolve, reject) => {
    User.postUser(data, {
      success(res) {
        if (res.statusCode === 201) {
          const _result = Object.assign({}, res.data, {updated: false})
          saveUserToLocal(_result)
          resolve(_result)
        } else {
          reject(Util.resetError(res, '注册失败'))
        }
      },
      fail(error) {
        reject(Util.resetError(error, '网络错误，注册失败'))
      }
    })
  })
}

/**
 * 更新用户信息
 * @param {*} userId 
 * @param {*} data 
 */
function updateUser(userId, data) {
  return new Promise((resolve, reject) => {
    User.updateUser('/'+ userId, data, {
      success(res) {
        if (res.statusCode === 200) {
          const _result = Object.assign({}, app.globalData.user, data, {updated: true})
          saveUserToLocal(_result)
          resolve(_result)
        } else {
          reject(Util.resetError(res, '更新失败'))
        }
      },
      fail(error) {
        reject(Util.resetError(error, '网络错误，更新失败'))
      }
    })
  })
}

/**
 * 更新用户一生时间
 * @param {[obj]} object 出生和死亡时间 [date格式] 
 */
function updateUserLife({ bornAt, dieAt }) {
  const data = {
    'bornAt': {
      '__type': 'Date',
      'iso': bornAt
    },
    'dieAt': {
      '__type': 'Date',
      'iso': dieAt
    }
  }
  return new Promise((resolve, reject) => {
    updateUser(app.globalData.user['objectId'], data).then(res => {
      resolve(res)
    }).catch(error => {
      reject(error)
    })
  })
}


module.exports = {
  saveUserToLocal,
  getUsers,
  checkUser, userLogin,
  postUser, updateUser,
  updateUserLife
}
