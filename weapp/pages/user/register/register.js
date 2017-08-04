// register.js
var app = getApp()
import md5 from '../../../libs/md5.min'
import Utils from '../../../utils/util'
import { addUser, getUsers, saveLocalUser } from '../../../utils/user'



Page({

  /**
   * 页面的初始数据
   */
  data: {
    fields: {
      username: '',
      password: ''
    },
    valid: [],
    userInfo: null,
    authDeny: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    const USER = app.globalData.user
    // 用户已登录
    if (USER && USER['sessionToken']) {
      /* wx.redirectTo({
        url: '/pages/index/index',
      }) */
      return;
    }
    // 检测用户openid是否存在
    if (!USER || !USER['openId']) {
      wx.redirectTo({
        url: '/pages/index/index',
      })
      return;
    }
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
  // 验证表单
  validForm(fields) {
    var rules = {
      username: {
        regx: /^[a-zA-Z_0-9]{4,16}$/g,
        msg: '用户名不正确[4-16位]'
      },
      password: {
        regx: /^[a-zA-Z0-9~!@#$%^&*()-_+]{6,18}$/g,
        msg: '密码格式不正确 [8-18位]'
      }
    }
    var errMsg = []
    for (let v in fields) {
      if (!rules[v]['regx'].test(fields[v])) {
        errMsg.push(rules[v].msg)
      }
    }
    this.setData({
      valid: errMsg
    })
  },
  /**
   * 用户注册流程：
   * 1. 检测是否已获取用户微信信息
   * 2. 验证表单
   * 3. 检测用户名是否可用
   * 4. 验证都通过，合并要提交的信息
   * 5. 提交注册
   */
  register(e) {
    console.log(e)
    // 1. 微信授权 (检测用户微信信息)
    if (e.detail.userInfo) {
      this.setData({
        authDeny: false,
        userInfo: e.detail.userInfo
      })
    } else {
      this.setData({
        authDeny: true
      })
      return;
    }
    const fields = this.data.fields
    // 2. 验证表单
    this.validForm(fields)
    if (this.data.valid.length > 0) return;
    // 3. 检测用户微信信息
    this.checkUserName(fields.username, () => {
      this.saveUser({
        name: fields.username,
        pwd: fields.password
      })
    })

  },
  // 检测用户名是否可用
  checkUserName(name, cb) {
    getUsers({
      where: { username: name },
      keys: 'username'
    }).then(res => {
      if (res.data.results.length > 0) {
        this.setData({
          valid: ['用户名已被占用']
        })
      } else {
        typeof cb === 'function' && cb()
      }
    })
  },
  //用户注册
  saveUser(options = {}) {
    const data = this.megerData(options)
    console.log('用户信息 ： ', data)
    addUser({
      data,
      success(res) {
        console.log('注册成功 ： ', res)
        saveLocalUser(res.data)
        wx.showToast({
          title: '注册成功',
          icon: 'success',
          duration: 1000,
          success() {
            wx.navigateBack()
          }
        })
      },
      fail(error) {
        console.error('注册失败 : ', error)
        this.setData({
          valid: ['注册失败']
        })
      }
    })
  },
  // 注册时 需要提交的数据
  megerData({ name, pwd }) {
    const password = md5(pwd).slice(5, 25)
    const umm = md5(pwd).slice(5)
    let ret = Object.assign({}, this.data.userInfo, {
      openId: app.globalData.user.openId,
      username: name,
      password,
      umm
    })
    return ret;
  }
})