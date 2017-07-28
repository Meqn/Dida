
const app = getApp()
// import getSystemInfo from '../../../utils/system'
// import { getUser } from '../../../utils/user'
// import Crypt from '../../libs/WXBizDataCrypt'

Page({
  data: {
    user: {
      avatarUrl: 'http://static.mengqing.org/extension/avatar.png',
      nickName: '昵称'
    }
  },
  onLoad: function () {
    this.wxUserInfo()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },
  wxLogin (cb) {
    wx.login({
      success(res) {
        console.log(res)
        cb && cb(res)
      }
    })
  },
  wxUserInfo(res) {
    wx.getUserInfo({
      withCredentials: true,
      success(res) {
        console.log(res)
      }
    })
  }

})