import Qdate from '../../../../libs/date'

// index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    calendar: {
      date: {
        val: '2017/08/15',
        year: 2017,
        month: 8,
        day: 15
      },
      week: ['日', '一', '二', '三', '四', '五', '六'],
      month: '',
      day: []
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setCalendar()
  },
  getMonth() {
    const dt = this.data.calendar.date
    const M = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二']
    return `${M[dt.month - 1]}月 ${dt.year}`
  },
  getDay() {
    const dt = this.data.calendar.date
    return Qdate.getDateInMonth(dt.year, dt.month, 'd')
  },
  setCalendar() {
    this.setData({
      'calendar.month': this.getMonth(),
      'calendar.day': this.getDay()
    })
  },
  prevMonth() {
    const dt = this.data.calendar.date
    let m = dt.month === 1 ? 12 : dt.month - 1
    let y = dt.month === 1 ? dt.year - 1 : dt.year
    this.setData({
      'calendar.date.year': y,
      'calendar.date.month': m
    })
    this.setCalendar()
  },
  nextMonth() {
    const dt = this.data.calendar.date
    let m = dt.month === 12 ? 1 : dt.month + 1
    let y = dt.month === 12 ? dt.year + 1 : dt.year
    this.setData({
      'calendar.date.year': y,
      'calendar.date.month': m
    })
    this.setCalendar()
  }
})