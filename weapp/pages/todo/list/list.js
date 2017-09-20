const app = getApp()
import Qdate from '../../../libs/scripts/date'
import Swipe from '../../../libs/scripts/swipe'
import Util from '../../../utils/util'
import Todo from '../includes/todo'
import { ALL } from '../includes/const'

let ThisDataTodo
let TouchXY = {x1: 0, x2: 0, y1: 0, y2: 0}

Page({
  data: {
    status: 'loading',
    moveId : '',
    data: {
      todo: [],   // 当前分类 todo 列表
      count: 0,   // 当前分类 todo 数量
      type: '',
      state: ALL.state
    }
  },
  onLoad: function (opts) {
    console.log('onLoad : ', opts)
    

    if (!opts.type || !opts.val) return wx.navigateTo({url: '/pages/todo/class/class'})
    // 设置标题
    this.setTitle(opts, res => {
      wx.setNavigationBarTitle({title: res})
    })
    // 获取todo数据
    this.getTodo(opts)
  },
  onHide() {
    this.setData({moveId: ''})
  },
  onTouchStart(e) {
    let eTouch = e.changedTouches[0]
    TouchXY.x1 = eTouch.pageX
    TouchXY.y1 = eTouch.pageY
  },
  onTouchEnd(e) {
    const _todoId = e.currentTarget.dataset.todoid
    const ctx = this
    let eTouch = e.changedTouches[0]
    TouchXY.x2 = eTouch.pageX
    TouchXY.y2 = eTouch.pageY

    Swipe(TouchXY, {
      swipe(dir) {
        if (dir !== 'Left') ctx.setData({moveId: ''})
      },
      swipeLeft() {
        if (_todoId !== ctx.data.moveId) ctx.setData({moveId: _todoId})
      }
    })
  },
  onDelete(e) {
    wx.showModal({
      content: '删除后，就找不回来了',
      cancelColor: '#80848f',
      confirmColor: '#ff4949',
      success(res) {
        if (res.confirm) {
          console.log('删除啦')
        } else {
          console.log('删除失败')
        }
      }
    })
  },
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
          if (v.objectId === dt.todoid)
            v.doneAt = requestData.doneAt
        }, 0)
        this.setTodo(ThisDataTodo, this.data.type)
        Util.storageUpdate('todoList')
      })
    }
  },
  setTitle({type, val}, cb = null) {
    let ret = '归档'
    if (type === 'class') {
      Todo.getClass().then(res => {
        /* res.reduce((acc, v, k) => {
          if (v.objectId === val)
            ret = v.title
        }, 0) */
        ret = app.globalData.todoClass[val].title
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
  getTodo({type, val}) {
    if (type === 'invite') {
      Todo.getFollow().then(data => {
        let result = data.length > 0 ? data.reduce((acc, v, k) => {
          acc.push(v.todo)
          return acc
        }, []) : []
        // result
        this.setTodo(result, type)
      })
    } else {
      Todo.todoArchive(data => {
        const _list = data.size[val]
        let result = (_list && _list instanceof Array) ? _list : []
        // result
        this.setTodo(result, type)
      })
    }
  },
  setTodo(todo, type) {
    ThisDataTodo = todo         // 临时缓存
    const _todo = type === 'mode' ? todo : Todo.getTodoOfState(todo)
    this.setData({
      status: 'end',
      'data.todo': _todo,
      'data.type': type,
      'data.count': todo.length
    })
  }
})