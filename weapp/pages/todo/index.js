import Qdate from '../../libs/date'
import Todo from './includes/todo'
import Archive from './includes/archive'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: 'loading',
    calendar: {
      month: '',
      week: [],
      day: []
    },
    todo: {
      all: [],
      week: [],
      next: [],
      expired: []
    },
    dateText: [new Date().format('yyyy/MM/dd'), Qdate.weekDay(8).format('yyyy/MM/dd')]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 设置日历📆
    this.setCalendar()

    this.getTodo(res => {
      console.log(res)
      this.setData({
        status: 'end',
        todo: res
      })
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow () {
    console.log('page show ...')
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide () {
    console.log('page hide ...')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload () {
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
  todoLink(e) {
    const ds = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/todo/detail/detail?todoId=${ds.todoid}&classId=${ds.classid}`
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
  },
  /* getTodo(cb) {
    const _todos = this.data.todo
    const _weekTodos = {
      do: [],
      doing: [],
      done: [],
      expired: []
    }
    const now = new Date().getTime(), weekStart = new Date(Qdate.weekDay(1).format('yyyy/MM/dd')).getTime(), weekEnd = new Date(Qdate.weekDay(8).format('yyyy/MM/dd')).getTime()
    Todo.getAllTodo().then(res => {
      _todos.all = res.results
      res.results.reduce((acc, v, k) => {
        let _week = Archive.ArchiveWeek(v, {now, weekStart, weekEnd})
        let _state = Archive.ArchiveState(v)

        if (_week) {
          if (_week === 'week') {
            _weekTodos[_state].push(v)
          } else {
            _todos[_week].push(v)
          }
        }
      }, 0)
      _todos.week = [..._weekTodos['doing'], ..._weekTodos['do'], ..._weekTodos['expired'], ..._weekTodos['done']]
      typeof cb === 'function' && cb(_todos)
    })
  }, */
  getTodo(cb) {
    let all = [], week = [], next = [], expired = []
    let weekList = {
      do: [],
      done: [],
      expired: []
    }

    const tw = Qdate.weekDay(1).format('yyyy/MM/dd'), nw = Qdate.weekDay(8).format('yyyy/MM/dd')
    const thisweek = new Date(tw).getTime()
    const nextweek = new Date(nw).getTime()

    Todo.getAllTodo().then(res => {
      all = res.results
      all.reduce((acc, v, k) => {
        const now = Qdate.get().timestamp
        const start = Qdate.get(v.startAt.iso).timestamp
        const end = Qdate.get(v.endAt.iso).timestamp

        // 本周
        if ((start < nextweek || end < nextweek) && end > thisweek) {
          // week.push(v)
          if (v.doneAt) {
            weekList.done.push(v)
          } else {
            if (now > end) {
              weekList.expired.push(v)
            } else {
              weekList.do.push(v)
            }
          }
        }
        // 下周及以后
        if (start >= nextweek) {
          next.push(v)
        }
        // 已过期
        if (now > end) {
          expired.push(v)
        }
      }, 0)

      week = [...weekList.do, ...weekList.expired, ...weekList.done]
      typeof cb === 'function' && cb({all, week, next, expired})
    })
  }
})