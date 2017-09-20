const app = getApp()
import Util from '../../utils/util'
import { checkUser, updateUserLife } from '../user/includes/user'
import Register from '../user/includes/register'
import Clock from './clock'
import User from './user'

let Timer = null

Page({
  data: {
    status: 'loading',  // 页面状态 loading, register, logged, date, end
    clock: {
      point: [],
      time: {
        hour: 0,
        minute: 0,
        second: 0,
        hourRotate: 0,
        minuteRotate: 0,
        secondRotate: 0
      }
    },
    life: {
      bornAt: '',
      dieAt: '',
      post: {
        status: 0,
        error: '',
        age: {
          index: 60,
          array: [],
          value: 0
        },
        born: '',
      },
      data: {
        die: false,
        past: {
          year: 0,
          month: 0,
          day: 0,
          week: 0,
          hour: 0,
          minute: 0,
          second: 0
        },
        later: {
          year: 0,
          month: 0,
          day: 0,
          week: 0,
          hour: 0,
          minute: 0,
          second: 0
        }
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
    const _user = app.globalData.user
    // 用户登录/注册
    if (_user && _user['sessionToken']) {
      this.onLogged(_user)
    } else {
      checkUser({
        onSuccess(res) {    // 登录成功
          ctx.onLogged(res)
        },
        onSign() {    // 用户未注册
          wx.setNavigationBarTitle({ title: '注册' })
          ctx.setData({ status: 'register' })
        },
        onError(error) {    // 微信登录错误
          console.error(error)
        }
      })
    }

    // Clock
    this.setData({
      'clock.point': Clock.point(150),          // Clock
      'life.post.age.array': User.ageRange(20, 120)      // 设置年龄段
    })
    this.interval()
  },
  interval() {
    const lifeData = this.data.life.data
    let s1 = lifeData.past.second,
      s2 = lifeData.later.second
    let t = (lifeData || s1 !== 0) ? 1 : 0
    this.setData({
      'clock.time': Clock.tick(),
      'life.data.past.second': s1 + t,
      'life.data.later.second': s2 - t
    })
  },
  onShow() {
    // 设置时钟定时器
    Timer = setInterval(this.interval, 1000)
  },
  onHide() {
    // 清除定时器
    clearInterval(Timer)
  },
  onUnload() {
    // 销毁定时器
    Timer = null
  },
  onShareAppMessage(res) {
    return {
      title: '人生过半，未来可期?',
      path: '/pages/index/index'
    }
  },
  // 登录成功回调
  onLogged(user) {
    console.log('登录成功 : ', user)
    if (user.bornAt && user.dieAt) {
      const bornAt = new Date(user.bornAt.iso)
      const dieAt = new Date(user.dieAt.iso)
      this.setData({
        status: 'logged',
        'life.bornAt': bornAt,
        'life.dieAt': dieAt,
        'life.data': User.getLife(bornAt, dieAt)
      })
    } else {
      this.setData({
        status: 'logged'
      })
    }
  },
  // 设置出生死亡时间
  onSetLife() {
    this.setData({
      status: 'date'
    })
  },
  // 设置出生
  onSetBorn(e) {
    this.setData({
      'life.post.born': e.detail.value
    })
  },
  // 设置死亡
  onSetDie(e) {
    this.setData({
      'life.post.age.index': e.detail.value,
      'life.post.age.value': this.data.life.post.age.array[e.detail.value]
    })
  },
  // 提交出生/死亡时间
  onSubmitLife() {
    const life = this.data.life.post
    const checkDate = User.checkDate(life.born, life.age.value)
    switch (typeof checkDate) {
      case 'string':
        Util.dataSet.call(this, {
          'life.post.error': checkDate
        }, 2500, {
          'life.post.error': ''
        })
        break;
      case 'object':
        this.setData({ 'life.post.status': 1 })
        const {bornAt, dieAt} = checkDate
        updateUserLife(checkDate).then(res => {
          this.setData({
            status: 'end',
            'life.post.status': 0,
            'life.bornAt': bornAt,
            'life.dieAt': dieAt,
            'life.data': User.getLife(bornAt, dieAt)
          })
        }).catch(error => {
          Util.dataSet.call(this, {
            'life.post.status': 0,
            'life.post.error': '设置失败, 请稍后操作'
          }, 2500, {
              'life.post.error': ''
            })
        })
        break;
    }
  },
  // 注册绑定数据
  onInputSign(e) {
    this.data.register.fields[e.currentTarget.id] = e.detail.value
  },
  // 提交注册
  onRegister(e) {
    if (this.data.register.status === 1) return
    
    const ctx = this
    const userInfo = e.detail.userInfo
    const fields = this.data.register.fields

    this.setData({
      'register.error': [],
      'register.status': 1
    })

    Register(fields, userInfo, {
      onSuccess(res) {
        wx.setNavigationBarTitle({title: '我的一生'})
        ctx.setData({
          'status': 'logged',
          'register.status': 0
        })
      },
      onError(error) {
        ctx.setData({
          'register.error': error,
          'register.status': 0
        })
      }
    })
  }
})
