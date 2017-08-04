const app = getApp()
import Util from '../../utils/util'
import { getUsers, addUser, updateUser, saveLocalUser } from '../../utils/user'

function ageRange(min, max) {
  let ages = []
  for (let i = min; i <= max; i++) {
    ages.push(i)
  }
  this.setData({
    'ages.value': ages
  })
}
function getLife(bornAt, dieAt) {
  let now = new Date()
  let diff1 = Util.diffTime(bornAt, now),
    diff2 = Util.diffTime(now, dieAt)
  let die = diff2 === 0 ? true : false
  return {
    die,
    prev: diff1,
    next: die ? {
      year: 0,
      month: 0,
      week: 0,
      day: 0,
      hour: 0,
      minute: 0,
      second: 0
    } : diff2
  }
}
function logged(user) {
  console.log('登录成功: ', user)
  this.setData({
    status: 'logged'
  })
  if (user.bornAt && user.dieAt) {
    const bornAt = user.bornAt.iso
    const dieAt = user.dieAt.iso
    // getLife
    this.setData({
      bornAt,
      dieAt,
      life: getLife(bornAt, dieAt)
    })
  }
}
function setLife() {
  const context = this
  const Data = this.data
  const now = new Date()
  const year = now.getFullYear(),
    month = now.getMonth() + 1,
    day = now.getDate(),
    hour = now.getHours(),
    minute = now.getMinutes(),
    second = now.getSeconds()

  const born = new Date(Data.setLife.born.replace(/-/g, '/') + ' ' + [hour, minute, second].join(':'))
  const die = new Date([Data.setLife.age + born.getFullYear(), month, day].join('/') + ' ' + [hour, minute, second].join(':'))
  console.log('更新 ： ', Data.setLife.born.replace(/-/g, '/'))
  console.log('更新的数据 ： ', born, die)
  const request = {
    'bornAt': {
      '__type': 'Date',
      'iso': born
    },
    'dieAt': {
      '__type': 'Date',
      'iso': die
    }
  }

  updateUser({
    id: app.globalData.user.objectId,
    data: request,
    success(res) {
      if (res.statusCode === 200) {
        console.log('更新成功 : ', res)
        let _data = Object.assign({}, app.globalData.user, request)
        saveLocalUser(_data)

        context.setData({
          status: 'end',
          'setLife.status': 0,
          bornAt: born,
          dieAt: die,
          life: getLife(born, die)
        })
      } else {
        console.error('更新失败 : ', res)
        context.setData({
          'setLife.status': 0,
          'setLife.error': '设置失败, 请稍后再试'
        })
        Util.setData.call(context, {
          'setLife.error': ''
        }, 2000)
      }
    }
  })
}
function checkUserName(username, cb) {
  getUsers({
    where: { username: username },
    keys: 'username'
  }).then(res => {
    if (res.statusCode === 200) {
      typeof cb === 'function' && cb(res.data)
    } else {
      console.error('获取用户失败 : ', res)
    }
  })
}
function postUser(data = {}, {success = null, fail = null}) {
    console.log('用户信息 ： ', data)
    addUser({
      data,
      success(res) {
        console.log('注册成功 ： ', res)
        saveLocalUser(res.data)
        typeof success === 'function' && success(res.data)
      },
      fail(error) {
        console.error('注册失败 : ', error)
        typeof fail === 'function' && fail(error)
      }
    })
  }


module.exports = {
  ageRange,
  logged,
  setLife,
  checkUserName,
  postUser
}