/**
 * [获取系统信息]
 * @param  {[fn]} success [成功回调]
 * @param  {[fn]} fail [失败回调]
 */
const getSystemInfo = function ({success = null, fail = null}) {
  wx.getStorage({
    key: 'systemInfo',
    success(res) {
      typeof success === 'function' && success(res.data)
    },
    fail() {
      wx.getSystemInfo({
        success (res) {
          typeof success === 'function' && success(res)
          wx.setStorage({
            key: 'systemInfo',
            data: res
          })
        },
        fail (error) {
          typeof fail === 'function' && fail(error)
        }
      })
    }
  })
}

module.exports = getSystemInfo