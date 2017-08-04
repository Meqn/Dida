import Sign from './lcSign'
import config from '../config'

Date.prototype.format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份 
    "d+": this.getDate(), //日 
    "h+": this.getHours(), //小时 
    "m+": this.getMinutes(), //分 
    "s+": this.getSeconds(), //秒 
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
    "S": this.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

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
function diffTime(startTime, endTime) {
  let start, end, diff, diffYear, diffMonth, diffDay, diffHour, diffMinute, diffSecond, diffWeek

  start = startTime instanceof Date ? startTime : new Date(startTime)
  end = endTime instanceof Date ? endTime : new Date(endTime)

  diff = end - start
  diffYear = end.getFullYear() - start.getFullYear()
  // 月 ＝ 相差年 * 12 + 相差月(天数之差)
  diffMonth = diffYear * 12 + (end.getMonth() - start.getMonth()) - ((end.getDate() - start.getDate()) < 0 ? 1 : 0)
  diffSecond = diff/1000
  diffMinute = diffSecond/60
  diffHour = diffMinute/60
  diffDay = diffHour/24
  diffWeek = diffDay/7

  let ret = diff > 0 ? {
    year: Math.floor(diffYear),
    month: Math.floor(diffMonth),
    week: Math.floor(diffWeek),
    day: Math.floor(diffDay),
    hour: Math.floor(diffHour),
    minute: Math.floor(diffMinute),
    second: Math.floor(diffSecond)
  } : 0
  return ret
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
 */
function setACL({ user = [], role = [] }) {
  const act = { "*": { read: true, write: false } }
  if (user.length > 0) {
    user.forEach(function (v) {
      act[v] = { "write": true }
    })
  }
  if (role.length > 0) {
    role.forEach(function (v) {
      act['role:' + v] = { "write": true }
    });
  }
  return act;
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

module.exports = {
  formatTime,
  diffTime,
  xhr,
  setACL,
  setData
}
