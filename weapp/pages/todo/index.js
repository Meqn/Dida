const app = getApp()
import Qdate from '../../libs/scripts/date'
import Todo from './includes/todo'
import Archive from './includes/archive'
import CONST from './includes/const'
import Util from '../../utils/util'

let ThisDataTodo
/* 
let DefaultTodo = {
  all: [],
  week: [],
  next: [],
  expired: []
}
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: 'loading',
    moveId: '',
    calendar: {
      month: '',
      week: [],
      day: []
    },
    todo: {},
    dateTodo: {
      hide: true,
      date: null,
      todo: []
    },
    dateText: [new Date().format('yyyy/MM/dd'), Qdate.weekDay(8).format('yyyy/MM/dd')]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('page onLoad ...')

    // 设置日历📆
    this.setCalendar()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    console.log('page onReady ...')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    console.log('page show ...')

    Todo.getAllTodo().then(res => {
      ThisDataTodo = res
      this.setTodo(res)
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    console.log('page onHide ...')

    setTimeout(() => {
      this.setData({
        'dateTodo.hide': true,
        'dateTodo.date': null
      })
    }, 500)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
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
  onTouchStart() {},
  onTouchEnd() {},
  todoLink(e) {
    const ds = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/todo/detail/detail?todoId=${ds.todoid}&classId=${ds.classid}`
    })
  },
  onDone(e) {
    const dt = e.currentTarget.dataset
    if (dt.done === 0) {
      const requestData = {
        'doneAt': {
          '__type': 'Date',
          'iso': new Date()
        }
      }
      Todo.updateTodo(dt.todoid, requestData).then(res => {
        ThisDataTodo.reduce((acc, v) => {
          if (v.objectId === dt.todoid) {
            v.doneAt = requestData.doneAt
          }
        }, 0)

        // 重置数据
        this.setTodo(() => {
          const date = this.data.dateTodo.date
          if (!date) return
          this.setData({
            'dateTodo.todo': Todo.getTodoOfDate(ThisDataTodo, date)
          })
        })
        // 更新缓存
        Util.storageUpdate('todoList')
        if(app.globalData.todo[dt.todoid]) app.globalData.todo[dt.todoid].updated = true
      }).catch(err => {
        Util.toast('操作失败', 'error')
      })
    }
  },
  onCalendar(e) {
    const _val = e.currentTarget.dataset.val
    this.setData({
      'dateTodo.hide': this.data.dateTodo.date === _val ? !this.data.dateTodo.hide : false,
      'dateTodo.date': _val,
      'dateTodo.todo': Todo.getTodoOfDate(ThisDataTodo, _val)
    })
  },
  // 获取日历的周
  getweek(w, t) {
    return {
      val: w,
      text: ['日', '一', '二', '三', '四', '五', '六'][w],
      status: t > w ? 'before' : t === w ? 'today' : 'after'
    }
  },
  // 获取日历的天
  getdate(num) {
    const now = new Date(new Date().format('yyyy/M/d')).getTime()
    const days = Qdate.getDateInWeek(null, 'yyyy/M/d')
    let arr = []
    days.forEach((v, k) => {
      arr.push({
        text: v.split('/')[2],
        val: v,
        status: now > new Date(v).getTime() ? 'before' : now === new Date(v).getTime() ? 'today' : 'after'
      })
    })
    return arr
  },
  // 设置日历 📅
  setCalendar() {
    const now = Qdate.get()
    const M = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二']
    const month = `${M[now.month - 1]}月 ${now.year}年`
    const week = [...Array(7).keys()].reduce((acc, val) => {
      acc.push(this.getweek(val, now.week))
      return acc
    }, [])
    this.setData({
      calendar: { month, week, day: this.getdate() }
    })
  },
  setTodo(cb) {
    // const _todos = JSON.parse(JSON.stringify(DefaultTodo))
    const _todos = {
      all: [],
      week: [],
      next: [],
      expired: []
    }
    const _weekTodos = CONST.todoState()
    const now = new Date().getTime(), weekStart = new Date(Qdate.weekDay(1).format('yyyy/MM/dd')).getTime(), weekEnd = new Date(Qdate.weekDay(8).format('yyyy/MM/dd')).getTime()
    
    ThisDataTodo.reduce((acc, v, k) => {
      let _week = Archive.ArchiveWeek(v, { now, weekStart, weekEnd })
      let _state = Archive.ArchiveState(v)
      if (_state === 'expired') {
        _todos['expired'].push(v)
      }
      if (_week) {
        _week === 'week' ? _weekTodos[_state].push(v) : _todos[_week].push(v)
      }
    }, 0)
    _todos['week'] = [..._weekTodos['doing'], ..._weekTodos['do'], ..._weekTodos['expired'], ..._weekTodos['done']]
    
    setTimeout(() => {
      this.setData({
        status: 'end',
        'todo.week': _todos.week,
        'todo.next': _todos.next,
        'todo.expired': _todos.expired
      })
      typeof cb === 'function' && cb(_todos)
    }, 0);
  }
})