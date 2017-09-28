const app = getApp()
import Qdate from '../../../libs/scripts/date'
import Swipe from '../../../libs/scripts/swipe'
import Util from '../../../utils/util'
import Todo from '../includes/todo'
import { ArchiveState } from '../includes/archive'
import { ALL } from '../includes/const'
import Batch from '../../../models/batch'
import RequestUrl from '../../../models/url'

let ThisDataTodo, PageParams = {}
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
    if (!opts.type || !opts.val) return wx.navigateTo({url: '/pages/todo/class/class'})
    PageParams = opts
    // 设置标题
    this.setTitle(opts, res => {
      wx.setNavigationBarTitle({title: res})
    })
  },
  onShow() {
    // 获取todo数据
    this.getTodo(PageParams)
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
  onEdit(e) {
    console.log('编辑： ', e)
    const _todo = e.currentTarget.dataset.todo
    const _status = ArchiveState(_todo)
    if (_status === 'done' || _status === 'expired') {
      const _text = _status === 'expired' ? '过期清单' : '清单已完成'
      return wx.showModal({
        content: _text +',无法修改',
        showCancel: false
      })
    }
    wx.navigateTo({
      url: '/pages/todo/create/create?todoId='+ _todo.objectId
    })
  },
  deleteFollow(todoId, cb) {
    Todo.getFollowByTodo(todoId).then(data => {
      if (data.length === 1) {
        Todo.deleteFollow(data[0]['objectId']).then(res => {
          typeof cb === 'function' && cb(res)
        })
      }
      if (data.length > 1) {
        let reqs = data.reduce((acc, v) => {
          acc.push({
            "method": 'DELETE',
            "path": RequestUrl.batch.todoFollow + '/' + v.objectId
          })
          return acc
        }, [])
        Batch(reqs).then(res => {
          typeof cb === 'function' && cb(res)
        })
      }
    })
  },
  onDelete(e) {
    const ctx = this
    const todoId = e.currentTarget.dataset.todoid
    wx.showModal({
      content: '删除后，就找不回来了',
      cancelColor: '#80848f',
      confirmText: '删除',
      confirmColor: '#ff4949',
      success(res) {
        if (res.confirm) {
          Todo.deleteTodo(todoId).then(res => {
            // 更新缓存
            Util.storageUpdate('todoList')
            if(app.globalData.todo[todoId]) app.globalData.todo[todoId].updated = true
            // 重置数据
            ctx.getTodo(PageParams)
            // ctx.setTodo(ThisDataTodo, ctx.data.type)
            // 删除参与者
            ctx.deleteFollow(todoId)
          }).catch(error => {
            console.error(error)
            Util.toast('删除失败', 'error')
          })
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
        // 更新缓存
        Util.storageUpdate('todoList')
        if(app.globalData.todo[dt.todoid]) app.globalData.todo[dt.todoid].updated = true
        // 重置数据
        this.setTodo(ThisDataTodo, this.data.type)
      }).catch(err => {
        Util.toast('操作失败', 'error')
      })
    }
  },
  setTitle({type, val}, cb = null) {
    let ret = '归档'
    if (type === 'class') {
      Todo.getClass().then(res => {
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
        console.log('getFollow: ', data)
        let result = data.length > 0 ? data.reduce((acc, v, k) => {
          if (v.todo) {
            acc.push(v.todo)
          } else {
            Todo.deleteFollow(v.objectId)
          }
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