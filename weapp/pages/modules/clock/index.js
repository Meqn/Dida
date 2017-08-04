const app = getApp()
import Util from '../../../utils/util'
import User, { checkUser, updateUser, saveLocalUser } from '../../../utils/user'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    points: [],
    clock: {
      hour: 0,
      minute: 0,
      second: 0,
      hourRotate: 0,
      minuteRotate: 0,
      secondRotate: 0
    },
    bornAt: 0,
    dieAt: 0,
    timeLeft: {
      index: 0,
      value: [3, 5, 10, 18, 20, 25, 30, 36, 40, 50, 60, 70, 80, 90, 100]
    },
    username: '昵称'
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
    const USER = app.globalData.user
    if (USER && USER['sessionToken']) {
      // 已登录
      console.log('用户已登录', USER)
      this.setData({
        username: USER.nickName
      })
    } else {
      checkUser({
        success: () => {
          this.setData({
            username: app.globalData.user.nickName
          })
        }
      })
    }
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
  getTimePoint(r) {
    let points = []
    for (let i = 0; i < 60; i++) {
      let rad = 2 * Math.PI / 60 * i
      let x = r * Math.cos(rad),
        y = r * Math.sin(rad),
        classname = i % 5 === 0 ? 'h' : 'm';
      points.push({ classname, x: r + x + 7, y: r + y + 7 })
    }
    return points;
  },
  tick() {
    let now = new Date()
    let hour = now.getHours(),
      minute = now.getMinutes(),
      second = now.getSeconds();
    let secondRotate = second * 6,  // second * (360/60)
      minuteRotate = minute * 6,
      hourRotate = hour * 30 + minute / 2;  // hour * (360/12) + minute / 2 

    this.setData({
      clock: {
        hour,
        minute,
        second,
        hourRotate,
        minuteRotate,
        secondRotate
      }
    })
  },
  setBornDate(e) {
    console.log(e)
    this.setData({
      bornAt: e.detail.value
    })
    const { hour, minute, second } = this.data.clock
    const bornAt = {
      '__type': 'Date',
      'iso': new Date(e.detail.value + ' ' + hour + ':' + minute + ':' + second)
    }
    updateUser({
      id: app.globalData.user.objectId,
      data: { bornAt },
      success(res) {
        if (res.statusCode === 200) {
          console.log('res : ', res)
          let _data = Object.assign({}, app.globalData.user, { bornAt })
          saveLocalUser(_data)
        } else {
          console.error('更新失败 : ', res)
        }
      }
    })
  },
  setDieDate(e) {
    console.log(e)
    this.setData({
      dieAt: e.detail.value
    })
  }
})