const app = getApp()
import { Request } from '../utils/lean'
import RequestUrl from './url'


/**
 * 获取微信用户openId
 * @param {[obj]} code 微信用户登录凭证code
 * @param {[obj]} 数据回调方法 
 */
function getUserId(code, { success, fail }) {
  wx.request({
    url: RequestUrl.weapp.user,
    data: { code },
    success,
    fail
  })
}

/**
 * 用户登录
 * @param {[obj]} object 用户名和密码
 * @param {[obj]} object 数据回调方法
 */
function login({ username, password }, { success, fail }) {
  Request({
    url: `${RequestUrl.user.login}?username=${username}&password=${password.slice(0, 20)}`,
    success,
    fail
  })
}

/**
 * 获取用户列表
 * @param {[obj]} condition 筛选条件
 * @param {[obj]} 数据回调方法 
 */
function getUsers(condition, {success, fail}) {
  Request({
    url: RequestUrl.user.user + condition,
    signType: 'master',
    success,
    fail
  })
}

/**
 * 创建用户
 * @param {[obj]} data 字段数据
 * @param {[obj]} 数据回调方法 
 */
function postUser(data = {}, {success, fail}) {
  Request({
    url: RequestUrl.user.user,
    method: 'POST',
    data,
    success,
    fail
  })
}

/**
 * 获取用户信息
 * @param {[obj]} userId 用户id
 * @param {[obj]} 数据回调方法 
 */
function getUser(userId, {success, fail }) {
  Request({
    url: RequestUrl.user.user + '/' + userId,
    success,
    fail
  })
}

/**
 * 更新用户信息
 * @param {[str]} condition 筛选条件
 * @param {[obj]} data 更新字段数据
 * @param {[obj]} 数据回调方法 
 */
function updateUser(condition, data = {}, {success, fail}) {
  Request({
    url: RequestUrl.user.user + condition,
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
  getUserId,
  getUsers, login,
  postUser, getUser, updateUser
}