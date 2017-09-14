import Sign from './lcSign'
import config from '../config'


function formatTime(date) {
  var date = typeof date === 'string' ? new Date(date) : date
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function subFloat(val, num) {
  var str = val.toString()
  var i = str.indexOf('.')
  if (typeof val !== 'number' || i === -1) return val;
  return parseFloat(str.slice(0, i + num + 1))
}

/**
 * 封装 wx.request 请求
 */
function xhr({ url, method = 'GET', dataType = 'json', contentType = 'application/json', header = {}, lcSignType = 'app', data = {}, success, fail, complete }) {
  let _sign, _signStr, _header
  if (lcSignType && lcSignType === 'master') {
    _sign = Sign('master')
    _signStr = ',master'
  } else {
    _sign = Sign()
    _signStr = ''
  }
  _header = Object.assign({}, {
    'Content-Type': contentType,
    'X-LC-Id': config.appId,
    'X-LC-Sign': _sign.sign + ',' + _sign.timestamp + _signStr
  }, header)
  wx.request({
    url: 'https://api.leancloud.cn/1.1' + url,
    method,
    dataType,
    data,
    header: _header,
    success(data) {
      typeof success === 'function' && success(data)
    },
    fail(error) {
      typeof fail === 'function' && fail(data)
    },
    complete(res) {
      typeof complete === 'function' && complete(res)
    }
  })
}
/**
 * 设置 ACL 权限
 * all [0:无读写 1:读 2:写]
 */
function setACL({ all = 1, user = [], role = [] }) {
  const act = {}
  act['*'] = { read: all > 0 ? true : false, write: all > 1 ? true : false }
  if (user.length > 0) {
    user.forEach(function (v) {
      act[v] = { read: true, write: true }
    })
  }
  if (role.length > 0) {
    role.forEach(function (v) {
      act['role:' + v] = { read: true, write: true }
    });
  }
  return act;
}

/**
 * 发送模版消息
 * @param {[Obj]} data 模版消息数据
 */
function sendMessage(data, payload = {}) {
  wx.request({
    url: 'https://api.jiabe.com/weapp/notice',
    method: 'POST',
    data: data,
    success(res) {
      typeof payload.success === 'function' && payload.success(res)
    },
    fail(res) {
      typeof payload.fail === 'function' && payload.fail(res)
    }
  })
}

function setData(options = {}, time = 0, cb = null) {
  if (time > 0) {
    setTimeout(() => {
      this.setData(options)
      typeof cb === 'function' && cb()
    }, time);
  } else {
    this.setData(options)
  }
}
function setError(err, msg) {
  return {
    error: err,
    errMsg: msg
  }
}
function storageUpdate(key) {
  try {
    const local = wx.getStorageSync(key)
    local.updated = true
    wx.setStorage({
      key: key,
      data: local
    })
  } catch (error) {
    throw error
  }
}

module.exports = {
  xhr,
  setACL,
  setData,
  subFloat,
  sendMessage,
  setError,
  storageUpdate
}
