App({
  onLaunch: function (options) {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    try {
      this.globalData.user = wx.getStorageSync('user') || null
    } catch (error) {
      console.error('getStorageSync error : ', error)
    }
  },
  globalData: {
    user: null
  }
})
