// home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sliders: [
      {
        image: 'http://static.mengqing.org/src/pic_450_360@1.jpg',
        link: '/pages/index/index'
      },
      {
        image: 'http://static.mengqing.org/src/pic_450_360@2.jpg',
        link: '/pages/index/index'
      },
      {
        image: 'http://static.mengqing.org/src/pic_450_360@3.jpg',
        link: '/pages/index/index'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
    console.log('page show ...')
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('page hide ...')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('page unload ...')
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
  
  }
})