const app = getApp()
import Qdate from '../../libs/scripts/date'

/**
 * 年龄范围
 * @param {*} min 
 * @param {*} max 
 */
function ageRange(min, max) {
  let ages = []
  for (let i = min; i <= max; i++) {
    ages.push(i)
  }
  return ages
}

/**
 * 获取用户一生的详细时间
 * @param {*} bornAt 生于
 * @param {*} dieAt 死于
 */
function getLife(bornAt, dieAt) {
  const bornDiff = Qdate.diff(bornAt)
  const dieDiff = Qdate.diff(null, dieAt)
  const die = dieDiff.is === 0 ? true : false

  return {
    die,
    past: bornDiff,
    later: die ? {
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

/**
 * 验证用户设置的时间信息
 * @param {*} born 出生年月
 * @param {*} age 死亡年龄
 */
function checkDate(born, age) {
  let ret
  if (!born || !age) {
    ret = '请设置出生时间和死亡年龄'
  } else {
    const now = Qdate.get()
    const bornAt = new Date(born.replace(/-/g, '/') +' '+ [now.hour, now.minute, now.second].join(':'))
    const dieAt = Qdate.add({ year: parseInt(age, 10) }, bornAt).date
    if (now.timestamp >= dieAt.getTime()) {
      ret = '做人要真诚，请不要诈尸'
    } else {
      ret = { bornAt, dieAt }
    }
  }
  return ret
}


module.exports = {
  ageRange,
  checkDate,
  getLife
}