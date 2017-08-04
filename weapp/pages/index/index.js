const app = getApp()
import Util from '../../utils/util'
import Clock from 'clock'
import md5 from '../../libs/md5.min'
import {ageRange, logged, setLife, checkUserName, postUser} from 'user'
import { checkUser } from '../../utils/user'

let timer = null

Page({
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
    status: 'loading',  // 页面状态 loading, register, logged, date, end
    bornAt: 0,
    dieAt: 0,
    ages: {
      index: 0,
      value: []
    },
    setLife: {
      born: 0,
      age: 0,
      status: 0,
      error: ''
    },
    life: {
      die: 0,
      prev: {
        year: 0,
        month: 0,
        day: 0,
        week: 0,
        hour: 0,
        minute: 0,
        second: 0
      },
      next: {
        year: 0,
        month: 0,
        day: 0,
        week: 0,
        hour: 0,
        minute: 0,
        second: 0
      }
    },
    register: {
      status: 0,
      fields: {
        username: '',
        password: ''
      },
      error: []
    }
  },
  onLoad: function () {
    const context = this
    const USER = app.globalData.user
    // 用户登录/注册
    if (USER && USER['sessionToken']) {
      logged.call(this, USER)
    } else {
      checkUser({
        register() {
          wx.setNavigationBarTitle({
            title: '注册',
          })
          context.setData({
            status: 'register'
          })
        },
        success(data) {
          logged.call(context, data)
        }
      })
    }
    
    // Clock
    this.setData({
      points: Clock.point(150)
    })
    Clock.tick.apply(this)

    // 设置年龄段
    ageRange.call(this, 20, 120);


  },
  onShow() {
    // 设置时钟定时器
    timer = setInterval(Clock.tick.bind(this), 1000)
  },
  onHide() {
    // 清除定时器
    clearInterval(timer)
  },
  onUnload() {
    // 销毁定时器
    timer = null
  },
  onShareAppMessage(res) {
    if (res.from === 'button') {
      console.log('来自页面内的转发 ： ', res)
    }
    return {
      title: '人生过半，未来可期?',
      path: '/pages/index/index',
      success(data) {
        console.log('分享成功：', data)
      }
    }
  },
  // 设置出生死亡时间
  dateBtnClick() {
    this.setData({
      status: 'date'
    })
  },
  // 提交出生死亡时间
  dateSubmit() {
    const life = this.data.setLife
    // 请真诚一点，不要诈尸
    if (life.born === 0 || life.age === 0) {
      this.setData({
        'setLife.error': '请设置出生和享年'
      })
      Util.setData.call(this, {
        'setLife.error': ''
      }, 2000)
      return;
    }
    this.setData({
      'setLife.status': 1
    })
    setLife.call(this)
  },
  // 设置出生
  setBornDate(e) {
    this.setData({
      'setLife.born': e.detail.value
    })
  },
  // 设置死亡
  setDieDate(e) {
    this.setData({
      'ages.index': e.detail.value,
      'setLife.age': this.data.ages.value[e.detail.value]
    })
  },
  // 注册绑定数据
  regBindInput(e) {
    this.data.register.fields[e.currentTarget.id] = e.detail.value
  },
  // 验证注册表单
  regCheck(fields) {
    var rules = {
      username: {
        regx: /^[a-zA-Z_0-9]{4,16}$/g,
        tip: '用户名必须是4-16字母或数字组成'
      },
      password: {
        regx: /^[a-zA-Z0-9~!@#$%^&*()-_+]{6,18}$/g,
        tip: '密码必须是6-18位字符'
      }
    }
    var error = []
    for (let v in fields) {
      if (!rules[v]['regx'].test(fields[v])) {
        error.push(rules[v].tip)
      }
    }
    return error
  },
  // 合并用户注册信息
  regMegerData({ name, pwd, userInfo }) {
    const password = md5(pwd).slice(5, 25)
    const umm = md5(pwd).slice(5)
    let ret = Object.assign({}, userInfo, {
      openId: app.globalData.user.openId,
      username: name,
      password,
      umm
    })
    return ret;
  },
  // 提交注册
  regSubmit(e) {
    console.log(e)
    const context = this
    this.setData({
      'register.error': [],
      'register.status': 1
    })
    // 1. 微信授权 (检测用户微信信息)
    const userInfo = e.detail.userInfo
    console.log(userInfo)
    if (!userInfo) {
      this.setData({
        'register.error': ['不授权, 你想咋样？'],
        'register.status': 0
      })
      return;
    }
    // 验证表单
    const fields = this.data.register.fields
    const fieldErr = this.regCheck(fields)
    if (fieldErr.length > 0) {
      this.setData({
        'register.error': fieldErr,
        'register.status': 0
      })
      return;
    }
    // 验证用户名
    checkUserName(fields.username, (res) => {
      if (res.results.length > 0) {
        context.setData({
          'register.error': ['用户名: '+ fields.username +' 已存在'],
          'register.status': 0
        })
        return;
      } else {
        // 提交用户信息
        const postData = context.regMegerData({
          name: fields.username,
          pwd: fields.password,
          userInfo
        })
        postUser(postData, {
          success(res) {
            wx.setNavigationBarTitle({
              title: '我的人生',
            })
            context.setData({
              status: 'logged',
              'register.status': 0
            })
          },
          fail(err) {
            context.setData({
              'register.error': ['注册失败, 稍后再试'],
              'register.status': 0
            })
          }
        })
      }
    })
  }
})
