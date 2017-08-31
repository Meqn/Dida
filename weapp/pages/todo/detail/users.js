import Swipe from '../../../libs/swipe'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    users: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let lists = []
    for (var i = 0; i < 8; i++) {
      lists[i] = {
        avatar: 'http://static.mengqing.org/src/pic_360_360@1.jpg',
        name: 'Morven',
        badge: '月亮高高云中藏',
        isMove: false
      }
    }
    lists[2].isMove = true
    this.setData({users: lists})
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
  onTouchStart(e) {
    console.log('onTouchStart : ', e)
    let target = e.changedTouches[0]
    touchXY.x1 = target.pageX
    touchXY.y1 = target.pageY
  },
  onTouchMove(e) {
    console.log('onTouchMove : ', e)
  },
  onTouchEnd(e) {
  }
})