const app = getApp()
import Qdate from '../../../libs/date'
import Todo from '../includes/todo'

Page({
  data: {
    status: 'loading',
    todoList: [],
    todoType: 'class'
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
    this.getTodo(opts, {
      success(res) {
        ctx.setData({
          status: 'end',
          todoList: res,
          todoType: opts.type
        })
      },
      fail(err) {
        wx.navigateTo({url: '/pages/todo/class/class'})
      }
    })
  },

  onReady: function () {
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
      }[val]
      typeof cb === 'function' && cb(ret)
    }
  },
  getTodo({type, val}, {success = null, fail = null}) {
    if (type === 'invite') {
      //
    } else {
      Todo.getTodoArchive().then(res => {
        let ret = []
        try {
          const results = res.archive[type][val]
          if (results.length < 1) return ret
          const todoList = wx.getStorageSync('todoList') || null
          todoList.results.reduce((acc, v, k) => {
            if (results.indexOf(v.objectId) !== -1) ret.push(v)
          }, 0)
          typeof success === 'function' && success(ret)
        } catch (err) {
          typeof fail === 'function' && fail(err)
        }
      })
    } 
  }
})