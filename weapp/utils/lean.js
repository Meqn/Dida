import Config from '../config'
import Md5 from '../libs/scripts/md5.min'

/**
 * 账户签名
 * @param  {[str]} type [签名类型 app|master]
 */
function Sign(type = 'app') {
  const _type = (type && type === 'master') ? 'masterKey' : 'appKey'
  const timestamp = new Date().getTime()
  const sign = Md5(timestamp + Config[_type])
  return {
    sign, timestamp
  }
}

/**
 * wx.request 请求
 */
function Request({ url, method = 'GET', dataType = 'json', contentType = 'application/json', header = {}, signType = 'app', data = {}, success, fail, complete }) {
  let _sign, _signStr, _header
  if (signType && signType === 'master') {
    _sign = Sign('master')
    _signStr = ',master'
  } else {
    _sign = Sign()
    _signStr = ''
  }
  _header = Object.assign({}, {
    'Content-Type': contentType,
    'X-LC-Id': Config.appId,
    'X-LC-Sign': _sign.sign + ',' + _sign.timestamp + _signStr
  }, header)
  wx.request({
    url,
    method,
    dataType,
    data,
    header: _header,
    success(res) {
      typeof success === 'function' && success(res)
    },
    fail(error) {
      typeof fail === 'function' && fail(error)
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
function ACL({ all = 1, user = [], role = [] }) {
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


module.exports = {
  Request,
  Sign,
  ACL
}