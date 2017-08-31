import Util from '../utils/util'
/**

Qdate()
  .get()
  .add()
  .diff(date)
  .far(date)
  .format(type)
  .isBefore(date)
  .isSame(date)
  .isAfter(date)
  .isBetween(date1, date2)
  .isLeapYear()

  .from(date)   // 2年前

 */
/**
 * []
 * @param  {[type]} date [description]
 * @param  {[type]} b [description]
 * @return {[type]}   [description]
 */



// 日期格式化
Date.prototype.format = function (fmt) {
  var week = ['日', '一', '二', '三', '四', '五', '六']
  var o = {
    "M+": this.getMonth() + 1, //月份 
    "d+": this.getDate(), //日 
    "h+": this.getHours(), //小时 
    "m+": this.getMinutes(), //分 
    "s+": this.getSeconds(), //秒 
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
    "w": this.getDay(),
    "S": this.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  if (/(wCN)/.test(fmt)) fmt = fmt.replace(RegExp.$1, week[this.getDay()]);
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

function zero(num) {
  return typeof num === 'number' ? num > 9 ? num : '0' + num : '00'
}

/**
 * [转换成时间格式 datetime]
 */
function toDate(date) {
  return !date ? new Date() : date instanceof Date ? date : typeof date === 'string' ? new Date(date.replace(/-/g, '/')) : new Date(date)
}

/**
 * [获取时间信息]
 */
function get(date) {
  const dt = toDate(date)
  let year, month, day, hour, minute, second, week

  year = dt.getFullYear()
  month = dt.getMonth() + 1
  day = dt.getDate()
  hour = dt.getHours()
  minute = dt.getMinutes()
  second = dt.getSeconds()
  week = dt.getDay()

  return {
    year, month, day, hour, minute, second, week, date: dt
  }
}

/**
 * 获取多少时间后的日期
 * @param  {[Obj]} Obj [设置时间段]
 * @param  {[date]} date [开始时间]
 */
function add({ year, month, day, hour, minute, second }, date) {
  const o = get(date)
  let dt = o.date
  if (year) {
    dt.setFullYear(o.year + year)
  }
  if (month) {
    dt.setMonth(o.month - 1 + month)
  }
  if (day) {
    dt.setDate(o.day + day)
  }
  if (hour) {
    dt.setHours(o.hour, hour)
  }
  if (minute) {
    dt.setMinutes(o.minute + minute)
  }
  if (second) {
    dt.setSeconds(o.second + second)
  }
  return get(dt)
}

// 几天后的日期
function dayAdd(num, date) {
  const dt = toDate(date)
  let d = dt.getDate()
  dt.setDate(d + num)
  return dt
}

/**
 * [两段时间的月差]
 */
function monthDiff(startTime, endTime) {
  let start, end, whole, anchor, adjust, daysMonth
  start = get(startTime)
  end = get(endTime)
  whole = (end.year - start.year) * 12 + (end.month - start.month)
  anchor = add({ month: whole }, start.date)
  daysMonth = new Date(end.year, end.month, 0).getDate()
  // adjust = end.date < anchor.date ? -1 : 0
  adjust = (end.date - anchor.date) / 1000 / 60 / 60 / 24 / daysMonth
  return whole + adjust
}

/**
 * [两段时间的时间差]
 */
function diff(startTime, endTime) {
  let is, start, end, diff, diffYear, diffMonth, diffDay, diffHour, diffMinute, diffSecond, diffWeek

  let oStart = get(startTime),
    oEnd = get(endTime)

  is = (oEnd.date - oStart.date) < 0 ? 0 : 1
  start = is ? oStart : oEnd
  end = is ? oEnd : oStart
  diff = Math.abs(oEnd.date - oStart.date)

  diffMonth = monthDiff(start.date, end.date)
  diffYear = diffMonth / 12
  diffSecond = diff / 1000
  diffMinute = diffSecond / 60
  diffHour = diffMinute / 60
  diffDay = diffHour / 24
  diffWeek = diffDay / 7
  return {
    is,
    year: Util.subFloat(diffYear, 1),
    month: Util.subFloat(diffMonth, 1),
    day: Math.floor(diffDay),
    hour: Math.floor(diffHour),
    minute: Math.floor(diffMinute),
    second: Math.floor(diffSecond),
    week: Math.floor(diffWeek)
  }
}

/**
 * [两段时间的间隔时间]
 */
function duration(startTime, endTime) {
  let start = toDate(startTime)
  let end = toDate(endTime)
  let dur = Math.round(end.getTime() - start.getTime()) / 1000 + end.getTimezoneOffset() * 60
  let ret = {
    year: 0,
    month: 0,
    hour: 0,
    day: 0,
    hour: 0,
    minute: 0,
    second: 0
  }
  if (dur > 0) {
    ret.second = Math.floor(dur % 60)
    ret.minute = Math.floor((dur / 60) % 60)
    ret.hour = Math.floor((dur / 3600) % 24)
    ret.day = Math.floor((dur / 86400) % 30)
    ret.month = Math.floor((dur / 2629744) % 12)    // 月份，以平均每月秒数计算
    ret.year = Math.floor(dur / 31556926)           // 年份，按回归年365天5时48分46秒算
  }
  return ret
}


/**
 * [距离当前时间: '5分钟后']
 * @param  {[type]} date [结束时间]
 */
function from(date) {
  const dt = diff(null, date)
  let suffix = dt.is ? '后' : '前'
  let text = ''
  switch (true) {
    case dt.year > 1:
      text = Math.floor(dt.year) + '年'
      break;
    case dt.month > 1:
      text = Math.floor(dt.month) + '个月'
      break;
    case dt.week > 1:
      text = Math.floor(dt.week) + '周'
      break;
    case dt.day > 1:
      text = Math.floor(dt.day) + '天'
      break;
    case dt.hour > 1:
      text = Math.floor(dt.hour) + '小时'
      break;
    case dt.minute > 1:
      text = Math.floor(dt.minute) + '分钟'
      break;
    default:
      text = Math.floor(dt.second) + '秒'
      break;
  }
  return text + suffix
}
/**
 * 比较两个时间 [-1: 之前; 0: 相同; 1: 之后]
 * @param {Date} startTime 
 * @param {Date} endTime 
 */
function compare(startTime, endTime) {
  let start = toDate(startTime).getTime()
  let end = toDate(endTime).getTime()
  return end > start ? 1 : end === start ? 0 : -1
}
/**
 * 周 转汉字
 * @param {[Num]} w 星期几
 */
function week(w) {
  return ['日', '一', '二', '三', '四', '五', '六'][parseInt(w, 10)]
}
/**
 * 月 转汉字
 * @param {[Num]} m 当前月份
 */
function month(m) {
  return ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'][parseInt(m, 10)]
}

/**
 * 获取当前日期周几的日期
 * @param {*} week 星期几
 * @param {*} date 当前日期
 */
function weekDay(week, date) {
  const today = toDate(date).getDay()
  return dayAdd(week - today, date)
}


/**
 * 获取某个月有几天
 */
function daysInMonth(year, month) {
  return new Date(year, month, 0).getDate()
}
/**
 * 获取某个月第一天星期几
 */
function firstDayInMonth(year, month) {
  return new Date(year, Number(month) - 1, 1).getDay()
}
/**
 * 获取某个月最后一天星期几
 */
function lastDayInMonth(year, month) {
  var day = daysInMonth(year, month)
  return new Date(year, Number(month) - 1, day).getDay()
}

/**
 * 是否闰年
 */
function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

/**
 * 获取时间数组
 */
function getTime() {
  let arr = [[], []]
  for (var i = 0; i < 24; i++) {
    arr[0][i] = zero(i)
  }
  for (var j = 0; j < 60; j++) {
    arr[1][j] = zero(j)
  }
  return arr
}

/**
 * 获取几天后的所有日期
 * @param  {[Num]} num [天数]
 * @param  {[Date]} date [开始日期]
 * @param  {[Str]} format [显示格式]
 * @return {[Arr]}   [返回值]
 */
function getDateAfterDays(num, date, fmt = 'yyyy/MM/dd') {
  let arr = []
  for (let i = 0; i <= num; i++) {
    arr.push(dayAdd(i, date).format(fmt))
  }
  return arr
}

/**
 * 获取某个日期的一周的所有日期
 * @param {[Date]} date 某个日期
 * @param {[Num]} start 一周开始 [0:周日 1:周一]
 */
function getDateInWeek(date, start = 0, fmt = 'yyyy/MM/dd') {
  let i, arr = []
  for (i = start; i <= 7; i++) {
    arr.push(weekDay(i, date).format(fmt))
  }
  return arr
}

/**
 * 获取当前日期的日历
 * @param {Str|Num} year 当前年份
 * @param {Str|Num} month 当前月份
 * @param {Str} fmt 日期格式化
 * @param {Num} start 一周开始 [周日: 0, 周一: 1]
 */
function getDateInMonth(year, month, fmt = 'yyyy/MM/dd', start = 0) {
  let dt = `${year}/${month}/1`
  return [...Array(42).keys()].reduce((acc, val) => {
    acc.push(weekDay(val + start, dt).format(fmt))
    return acc
  }, [])
}



module.exports = {
  toDate,
  get,
  add,
  diff,
  duration,
  from,
  dayAdd,
  compare,
  week,
  month,
  weekDay,
  daysInMonth,
  firstDayInMonth,
  lastDayInMonth,
  isLeapYear,
  getTime,
  getDateAfterDays,
  getDateInWeek,
  getDateInMonth
}

