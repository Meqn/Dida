import Sign from './lcSign'
import config from '../config'

function formatTime(date) {
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

/**
 * 封装 wx.request 请求
 */
function xhr({url, method = 'GET', dataType = 'json', contentType = 'application/json', header = {}, lcSignType = 'app', data = {}, success, fail, complete}) {
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
    success (data) {
      typeof success === 'function' && success(data)
    },
    fail (error) {
      typeof fail === 'function' && fail(data)
    },
    complete (res) {
      typeof complete === 'function' && complete(res)
    }
  })
}
/**
 * 设置 ACL 权限
 */
function setACL({user = [], role = []}) {
  const act = {"*": {read: true, write: false}}
  if (user.length > 0) {
    user.forEach(function(v) {
      act[v] = {"write": true}
    })
  }
  if (role.length > 0) {
    role.forEach(function(v) {
      act['role:'+v] = {"write": true}
    });
  }
  return act;
}

module.exports = {
  formatTime: formatTime,
  xhr,
  setACL
}
