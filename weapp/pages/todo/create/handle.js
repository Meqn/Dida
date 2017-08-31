const app = getApp()
import Qdate from '../../../libs/date'

// 优先级状态
function priorityStatus(num) {
  return {
    important: (num === 1 || num === 3) ? true : false,
    urgent: (num === 2 || num === 3) ? true : false,
    priority: num
  }
}
// 获取优先级的值
function getPriority(important, urgent) {
  return (important ? 1 : 0) + (urgent ? 2 : 0)
}
// 获取日历
function getDate() {
  let text = Qdate.getDateAfterDays(30, null, 'yyyy-MM-dd 周wCN')
  let val = Qdate.getDateAfterDays(30, null, 'yyyy/MM/dd')
  text[0] = text[0] + ' [今天]'
  text[1] = text[1] + ' [明天]'
  text[2] = text[2] + ' [后天]'
  return {text, val}
}
// 设置开始时间和完成时间
function setDate(date, type = 'start') {
  const dt = Qdate.toDate(date)
  const d = dt.format('yyyy/MM/dd')
  let index = getDate().val.indexOf(d)
  if (date) {
    index = index === -1 ? 0 : index
  } else {
    index = type === 'start' ? 1 : 2
  }

  return {
    time: dt.format('hh:mm'),
    index
  }
}




module.exports = {
  priorityStatus,
  getPriority,
  getDate,
  setDate
}