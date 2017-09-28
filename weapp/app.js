App({
  onLaunch: function (options) {
    //调用API从本地缓存中获取数据
    /* 
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)
     */
    
    console.log('注册小程序 ......')
    try {
      this.globalData.user = wx.getStorageSync('user') || null
      if (!this.globalData.user) {
        wx.navigateTo({
          url: '/pages/index/index'
        })
      }
    } catch (error) {
      console.error(error)
    }
    
    // 获取设备信息
    if (!this.globalData.systemInfo) {
      wx.getSystemInfo({
        success: res => {
          this.globalData.systemInfo = res
        }
      })
    }
  },
  onShow() {
  },
  /**
   * 全局数据
   * 
   * 1. temp 临时数据
   *    1.1 todoClass: {id: '', name: ''}     // 选择todo分类
   *    1.2 tip: {type:'warn', title: '', text: '', btn: [{text: '推荐操作', url: ''}, {text: '辅助操作', url: ''}]}    // 结果信息提示页
   * 
   */
  globalData: {
    user: null,
    systemInfo: null,
    temp: {},   // 临时数据, 比如选择分类
    todo: {},               // 缓存todo详情列表
    todoFollow: null,       // 缓存被邀请todo列表
    todoFollowCount: null   // 缓存被邀请Todo数量
  }
})
