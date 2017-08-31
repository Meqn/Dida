
const COLOR = {
  red: '#f44336',
  orange: '#ff9800',
  yellow: '#ffd422',
  green: '#04BE02',
  blue: '#2196f3',
  indigo: '#3f51b5',
  purple: '#9c27b0',
  pink: '#e91e63',
  cyan: '#00bcd4',
  teal: '#009688',
  brown: '#795548',
  black: '#212121'
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // setTimeout(this.setBarColor, 250);
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  setBarColor() {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: COLOR.blue,
      success(e) {
        console.log('success : ', e)
      },
      fail(e) {
        console.log('fail : ', e)
      }
    })
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