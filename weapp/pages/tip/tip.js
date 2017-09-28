const app = getApp()

/** 数据demo
  data: {
    type: 'warn',
    title: '操作失败',
    text: '网络错误或数据已被删除',
    callback: null,   // 默认回调函数
    btn: [{
      text: '推荐操作',
      type: 'primary',
      callback(e) {
        console.log('推荐操作 : ', e)
      }
    },{
      text: '辅助操作',
      type: 'default',
      callback(e) {
        console.log('辅助操作 : ', e)
      }
    }]
  }
*/
Page({
  data: {
  },
  onLoad: function (options) {
    if (app.globalData.temp.tip) {
      this.setData(app.globalData.temp.tip)
    } else {
      wx.switchTab({
        url: '/pages/todo/index'
      })
    }
  },
  onReady: function () {
  },
  onShow: function () {
    const _data = this.data
    if (_data.callback && typeof _data.callback === 'function') {
      _data.callback(this)
    }
  },
  onHide() {
  },
  onUnload() {
    // 清空数据
    app.globalData.temp.tip = null
  },
  onTap0(e) {
    const _evt = this.data.btn
    if (_evt && _evt.length > 0 && _evt[0].callback) {
      _evt[0].callback.call(this, e)
    }
  },
  onTap1(e) {
    const _evt = this.data.btn
    if (_evt && _evt.length === 2 && _evt[1].callback) {
      _evt[1].callback.call(this, e)
    }
  }
})