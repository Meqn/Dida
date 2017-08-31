// register.js
const app = getApp()
import Register from '../../../utils/register'

let regFlag = false

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
  register(e) {
    if (regFlag) return;
    regFlag = true
    const context = this
    const userInfo = e.detail.userInfo
    const fields = this.data.fields

    this.setData({
      'error': [],
      'status': 1
    })

    Register(fields, userInfo, {
      onSuccess(res) {
        regFlag = false
        context.setData({
          'status': 0
        })
        // 注册成功
      },
      onError(error) {
        regFlag = false
        context.setData({
          'error': error,
          'status': 0
        })
      }
    })
  }
})