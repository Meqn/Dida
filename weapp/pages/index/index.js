const app = getApp()
import Util from '../../utils/util'
import { checkUser } from '../../utils/user'
import Register from '../../utils/register'
import Clock from './clock'
import { ageRange, logged, checkDate, setLife } from 'user'

let timer = null, regFlag = false

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
    const ctx = this
    const USER = app.globalData.user
    // 用户登录/注册
    if (USER && USER['sessionToken']) {
      logged.call(this, USER)
    } else {
      checkUser({
        onSign() {
          wx.setNavigationBarTitle({title: '注册'})
          ctx.setData({status: 'register'})
        },
        onSuccess(data) {
          logged.call(ctx, data)
        },
        onError(error) {
          // ❌ 错误提示信息待完善
          console.error(error)
        }
      })
    }

    // Clock
    this.setData({
      points: Clock.point(150)
    })
    // Clock.tick.apply(this)
    this.interval()

    // 设置年龄段
    this.setData({
      'ages.value': ageRange(20, 120)
    })
  },
  interval() {
    let s1 = this.data.life.prev.second,
      s2 = this.data.life.next.second
    let t = (this.data.life.die || s1 !== 0) ? 1 : 0
    this.setData({
      clock: Clock.tick(),
      'life.prev.second': s1 + t,
      'life.next.second': s2 - t
    })
  },
  onShow() {
    // 设置时钟定时器
    timer = setInterval(this.interval, 1000)
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
    /* if (res.from === 'button') {
      console.log('来自页面内的转发 ： ', res)
    } */
    return {
      title: '人生过半，未来可期?',
      path: '/pages/index/index'
    }
  },
  // 设置出生死亡时间
  dateBtnClick() {
    this.setData({
      status: 'date'
    })
  },
  // 提交出生/死亡时间
  dateSubmit() {
    const life = this.data.setLife
    const dateError = checkDate(life.born, life.age)
    if (dateError) {
      this.setData({
        'setLife.error': dateError
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
  // 提交注册
  regSubmit(e) {
    if (regFlag) return;
    regFlag = true
    const context = this
    const userInfo = e.detail.userInfo
    const fields = this.data.register.fields

    this.setData({
      'register.error': [],
      'register.status': 1
    })

    Register(fields, userInfo, {
      onSuccess(res) {
        regFlag = false
        wx.setNavigationBarTitle({
          title: '我的一生',
        })
        context.setData({
          'status': 'logged',
          'register.status': 0
        })
      },
      onError(error) {
        regFlag = false
        context.setData({
          'register.error': error,
          'register.status': 0
        })
      }
    })
  }
})
