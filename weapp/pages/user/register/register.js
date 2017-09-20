// register.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: 0,
    fields: {
      username: '',
      password: ''
    },
    error: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断用户是否存在
    // 判断用户openId是否存在
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  },
  bindInput(e) {
    this.data.fields[e.currentTarget.id] = e.detail.value
  },
  register(e) {}
})