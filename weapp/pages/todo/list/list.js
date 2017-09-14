const app = getApp()
import Qdate from '../../../libs/date'
import Todo from '../includes/todo'
import { ALL } from '../includes/const'

Page({
  data: {
    status: 'loading',
    data: {
      todo: [],   // 当前分类 todo 列表
      count: 0,   // 当前分类 todo 数量
      type: '',
      state: ALL.state
    }
  },
  onLoad: function (opts) {
    console.log(opts)
    

    if (!opts.type || !opts.val) return wx.navigateTo({url: '/pages/todo/class/class'})

    const ctx = this
    // 设置标题
    this.setTitle(opts, res => {
      wx.setNavigationBarTitle({title: res})
    })
    // 获取todo数据
    this.getTodo(opts, (data, count) => {
      console.log('result : ', data)
      this.setData({
        status: 'end',
        'data.todo': data,
        'data.type': opts.type,
        'data.count': count
      })
    })
  },

  onReady: function () {
  },
  todoLink(e) {
    const ds = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/todo/detail/detail?todoId=${ds.todoid}&classId=${ds.classid}`
    })
  },
  onDone(e) {
    console.log('已完成', e, e.currentTarget.dataset)
    const dt = e.currentTarget.dataset
    if (dt.done === 5) {
      const requestData = {
        'doneAt': {
          '__type': 'Date',
          'iso': new Date()
        }
      }
      Todo.updateTodo(dt.todoid, requestData).then(res => {
        console.log('updateTodo : ', res)
        ThisDataTodo.reduce((acc, v) => {
          if (v.objectId === dt.todoid) {
            v.doneAt = requestData.doneAt
          }
        })
        this.setTodo(() => {
          const date = this.data.dateTodo.date
          if (!date) return
          this.setData({
            'dateTodo.todo': Todo.getTodoOfDate(ThisDataTodo, date)
          })
        })
        Util.storageUpdate('todoList')
      })
    }
  },
  setTitle({type, val}, cb = null) {
    let ret = '归档'
    if (type === 'class') {
      Todo.getClass().then(res => {
        res.results.reduce((acc, v, k) => {
          if (v.objectId === val)
            ret = v.title
        }, 0)
        typeof cb === 'function' && cb(ret)
      })
    } else {
      ret = {
        today: '今天',
        do: '未开始',
        doing: '进行中',
        done: '已完成',
        expired: '已过期',
        invite: '被邀请'
      }[val] || '归档'
      typeof cb === 'function' && cb(ret)
    }
  },
  getTodo({type, val}, cb = null) {
    if (type === 'invite') {
      Todo.getFollow().then(data => {
        let result = data.length > 0 ? data.reduce((acc, v, k) => {
          acc.push(v.todo)
          return acc
        }, []) : []
        const count = result.length
        typeof cb === 'function' && cb(Todo.getTodoOfState(result), count)
      })
    } else {
      Todo.todoArchive(data => {
        console.log(data)
        const _list = data.size[val]
        let result = (_list && _list instanceof Array) ? _list : []
        const count = result.length
        if (type === 'class') {
          result = Todo.getTodoOfState(result)
        }
        typeof cb === 'function' && cb(result, count)
      })
    }
  }
})