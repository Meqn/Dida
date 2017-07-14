// index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    points: [],
    hourRotate: 0,
    minuteRotate: 0,
    secondRotate: 0,
    date: '2016-09-01',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      points: this.getTimePoint(150)
    })
    this.tick()
    setInterval(this.tick, 1000)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
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
  getTimePoint (r) {
    let points = []
    for(let i = 0; i < 60; i++) {
      let rad = 2 * Math.PI / 60 * i
      let x = r * Math.cos(rad),
        y = r * Math.sin(rad),
        classname = i % 5 === 0 ? 'h' : 'm';
      points.push({classname, x: r + x + 7, y: r + y + 7})
    }
    return points;
  },
  tick () {
    let now = new Date()
    let hour = now.getHours(),
      minute = now.getMinutes(),
      second = now.getSeconds();
    let secondRotate = second * 6,  // second * (360/60)
      minuteRotate = minute * 6,
      hourRotate = hour * 30 + minute / 2;  // hour * (360/12) + minute / 2 
    
    this.setData({
      hour,
      minute,
      second,
      hourRotate,
      minuteRotate,
      secondRotate
    })
  },
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  }
})