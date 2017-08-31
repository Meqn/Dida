const app = getApp()
import Util from '../../utils/util'
import Qdate from '../../libs/date'
import { updateUser, saveLocalUser } from '../../utils/user'

function ageRange(min, max) {
  let ages = []
  for (let i = min; i <= max; i++) {
    ages.push(i)
  }
  return ages
}
function checkDate(born, age) {
  let error = null
  if (born === 0 || age === 0) {
    error = '请设置出生时间和死亡年龄'
  } else {
    const now = new Date()
    const bornAt = new Date(born.replace(/-/g, '/'))
    const dieAt = new Date([bornAt.getFullYear() + age, bornAt.getMonth() + 1, bornAt.getDate()].join('/'))
    if (now > dieAt) {
      error = '做人要真诚，请不要诈尸'
    }
  }
  return error
}
function getLife(bornAt, dieAt) {
  let bornDiff = Qdate.diff(bornAt, null),
    dieDiff = Qdate.diff(null, dieAt)
  
  let die = dieDiff.is === 0 ? true : false
  return {
    die,
    prev: bornDiff,
    next: die ? {
      year: 0,
      month: 0,
      week: 0,
      day: 0,
      hour: 0,
      minute: 0,
      second: 0
    } : dieDiff
  }
}
function logged(user) {
  console.log('登录成功: ', user)
  this.setData({
    status: 'logged'
  })
  if (user.bornAt && user.dieAt) {
    const bornAt = new Date(user.bornAt.iso)
    const dieAt = new Date(user.dieAt.iso)
    
    this.setData({
      bornAt,
      dieAt,
      life: getLife(bornAt, dieAt)
    })
  }
}
function setLife() {
  const context = this
  const lifeData = this.data.setLife
  let {hour, minute, second} = Qdate.get()

  const born = Qdate.toDate(lifeData.born +' '+ [hour, minute, second].join(':'))
  const die = Qdate.add({year: parseInt(lifeData.age, 10)}, new Date(born)).date

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


module.exports = {
  ageRange,
  logged,
  checkDate,
  setLife
}