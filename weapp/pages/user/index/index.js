const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {avatarUrl: 'http://static.mengqing.org/dot.png'}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {nickName, avatarUrl, signature, gender, dieAt, bornAt} = app.globalData.user
    this.setData({
      user: {nickName, avatarUrl, signature, gender, dieAt, bornAt}
    })
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
  
  },
  onClearCache() {
    app.globalData = {
      user: null,
      system: {},
      temp: {},
      todo: {},
      todoFollow: null,
      todoFollowCount: null
    }
    wx.clearStorage({
      success() {
        wx.reLaunch({url: '/pages/index/index'})
      }
    })
  },
  onViewAvatar(e) {
    wx.previewImage({
      urls: [`${e.currentTarget.dataset.avatar}`]
    })
  },
  onProfile(e) {
    wx.navigateTo({
      url: '/pages/user/profile/profile'
    })
  }
})