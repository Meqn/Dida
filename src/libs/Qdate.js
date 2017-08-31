

/* 
function Qdate(date) {
  if (!(this instanceof Qdate))
    return new Qdate(date) 
  this.date = this.toDate(date)
  // return this.date
}

Qdate.prototype = {
  constructor: Qdate,
  toDate: function(date) {
    return !date ? new Date() : date instanceof Date ? date : typeof date === 'string' ? new Date(date.replace(/-/g, '/')) : new Date(date)
  },
  getDate: function(date) {
    var dt = this.toDate(date)
    var year, month, day, hour, minute, second, week

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
  },
  gg:function(type) {
    var dt = this.getDate(this.date)
    return type ? dt[type] : dt
  }
}
 */

const Util = {
  toDate (date) {
    return !date ? new Date() : date instanceof Date ? date : typeof date === 'string' ? new Date(date.replace(/-/g, '/')) : new Date(date)
  },
  monthDiff(startTime, endTime) {
    let start, end, whole, anchor, adjust, daysMonth
    start = getDateNum(startTime)
    end = getDateNum(endTime)
    whole = (end.year - start.year) * 12 + (end.month - start.month)
    anchor = dateAdd({ month: whole }, start.date)
    daysMonth = new Date(end.year, end.month, 0).getDate()
    // adjust = end.date < anchor.date ? -1 : 0
    adjust = (end.date - anchor.date) / 1000 / 60 / 60 / 24 / daysMonth
    return whole + adjust
  }
}


class Qdate {
  constructor(date) {
    this.date = Util.toDate(date)
    const dt = this.get()
  }
  static toDate(date) {
    return Util.toDate(date)
  }
  get(type) {
    const dt = this.date
    let year, month, day, hour, minute, second, week

    year = dt.getFullYear()
    month = dt.getMonth() + 1
    day = dt.getDate()
    hour = dt.getHours()
    minute = dt.getMinutes()
    second = dt.getSeconds()
    week = dt.getDay()

    let ret = {
      year, month, day, hour, minute, second, week, date: dt
    }
    return typeof type === 'string' ? ret[type] : ret
  }
  _monthDiff(startTime, endTime) {
    let start, end, whole, anchor, adjust, daysMonth
    start = getDateNum(startTime)
    end = getDateNum(endTime)
    whole = (end.year - start.year) * 12 + (end.month - start.month)
    anchor = dateAdd({ month: whole }, start.date)
    daysMonth = new Date(end.year, end.month, 0).getDate()
    // adjust = end.date < anchor.date ? -1 : 0
    adjust = (end.date - anchor.date) / 1000 / 60 / 60 / 24 / daysMonth
    return whole + adjust
  }
  dateAdd({ year, month, day, hour, minute, second }, date) {
    const o = getDateNum(date)
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
    return getDateNum(dt)
  }
  diff(startTime, endTime) {
    let is, start, end, diff, diffYear, diffMonth, diffDay, diffHour, diffMinute, diffSecond, diffWeek

    let oStart = getDateNum(startTime),
      oEnd = getDateNum(endTime)

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
      year: diffYear,
      month: diffMonth,
      day: diffDay,
      hour: diffHour,
      minute: diffMinute,
      second: diffSecond,
      week: diffWeek
    }
  }
}








