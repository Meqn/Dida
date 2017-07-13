// clock.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timedots: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      timedots: this.setTimeDot(150)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log(this.timedots)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  setTimeDot(r, cb) {
    let dots = [], classname = ''
    for(let i = 0; i < 60; i++) {
      let rad = 2 * Math.PI / 60 * i
      let x = r * Math.cos(rad),
        y = r * Math.sin(rad)
      classname = i % 5 === 0 ? 'h' : 'm'
      dots.push({classname: classname, x: r + x + 7, y: r + y + 7})
    }
    return dots
    // typeof cb === 'function' && cb(dots)
  }
})