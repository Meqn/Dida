import Qdate from '../../libs/date'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    calendar: {
      month: '',
      week: [],
      day: []
    },
    todoList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 设置日历📆
    this.setCalendar()

    let lists = []
    for (let i = 0; i < 8; i++) {
      lists[i] = {
        title: '这是一个任务，我的第一件事还没有做呢？',
        time: i + '小时后',
        color: 'red',
        priority: 2,
      }
    }
    this.setData({ todoList: lists })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('page show ...')
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('page hide ...')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('page unload ...')
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  view() {
    wx.navigateTo({
      url: '/pages/todo/detail/detail'
    })
  },
  // 获取日历的周
  getweek(w, t) {
    let today = t === 0 ? 6 : t - 1
    return {
      val: ['一', '二', '三', '四', '五', '六', '日'][w],
      status: today > w ? 'before' : today === w ? 'today' : 'after'
    }
  },
  // 获取日历的天
  getdate(num) {
    const now = new Date(new Date().format('yyyy/M/d')).getTime()
    const days = Qdate.getDateInWeek(null, 1, 'yyyy/M/d')
    let arr = []
    days.forEach((v, k) => {
      arr.push({
        val: v.split('/')[2],
        status: now > new Date(v).getTime() ? 'before' : now === new Date(v).getTime() ? 'today' : 'after'
      })
    })
    return arr
  },
  // 设置日历 📅
  setCalendar() {
    const context = this
    const now = Qdate.get()
    const M = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二']
    const month = `${M[now.month - 1]}月 ${now.year}年`
    const week = [...Array(7).keys()].reduce((acc, val) => {
      acc.push(context.getweek(val, now.week))
      return acc
    }, [])
    this.setData({
      calendar: { month, week, day: context.getdate() }
    })
  }
})