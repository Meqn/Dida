
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

function dataSet(data = {}, time = 0, cb) {
  this.setData(data)
  if (time > 0) {
    setTimeout(() => {
      if(typeof cb === 'function') {
        cb()
      }
      if(typeof cb === 'object') {
        this.setData(cb)
      }
    }, time);
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

function resetError(error, errorText) {
  return Object.assign({}, error, {errorText})
}

module.exports = {
  subFloat,
  dataSet,
  storageUpdate,
  resetError
}
