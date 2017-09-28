const app = getApp()
import Util from '../../../utils/util'
import Qdate from '../../../libs/scripts/date'
import Handle from './handle'
import Todo from '../includes/todo'

// index.js
Page({
  data: {
    status: 'loading',
    post: {
      todoId: '',
      action: 'post',
      status: 0,
      error: '',
      title: '',
      content: '',
      urgent: false,        // 紧急: 2
      important: false,     // 重要: 1
      remind: true,
      dateTime: {
        start: {
          time: '',
          index: 1
        },
        end: {
          time: '',
          index: 1
        },
        date: {
          text: [],
          val: []
        }
      },
      class: {
        id: '',
        name: ''
      }
    }
  },
  onLoad: function (opts) {
    Handle.setDefaultData(opts.todoId, res => {
      const _post = Object.assign({}, this.data.post, res)
      this.setData({
        status: 'loaded',
        post: _post
      })
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      'post.class': app.globalData.temp.todoClass
    })
  },
  bindInput(e) {
    this.data.post[e.currentTarget.id] = e.detail.value
    /* 
    const param = {}, key = 'post['+e.currentTarget.id+']'
    param[key] = e.detail.value
    this.setData(param) */
  },
  // check 元素邦定
  bindCheck(e) {
    const param = {}
    const name = e.currentTarget.dataset.name
    const key = 'post.' + name
    const value = !this.data.post[name]
    param[key] = value
    this.setData(param)
  },
  bindDate(e) {
    const type = e.currentTarget.dataset.type
    const param = {}
    const key = `post.dateTime.${type}.index`
    param[key] = parseInt(e.detail.value, 10)
    this.setData(param)
  },
  bindTime(e) {
    const type = e.currentTarget.dataset.type
    const param = {}
    const key = `post.dateTime.${type}.time`
    param[key] = e.detail.value
    this.setData(param)
  },
  // 创建 todo
  todoPost(request, formId) {
    Todo.postTodo(request).then(res => {
      this.setData({
        'post.status': 0,
        'post.error': ''
      })
      Util.storageUpdate('todoList')    // 更新本地缓存
      if (res.remind) {
        Todo.TodoMessage(res, formId, 'create')    // 发通知
      }
      wx.redirectTo({url: `/pages/todo/detail/detail?todoId=${res.objectId}&classId=${res.classId}`})
    }).catch(error => {
      console.error(error)
      Util.toast('创建失败', 'error', {
        duration: 2000,
        complete() {
          setTimeout(() => {
            wx.switchTab({url: '/pages/todo/index'})
          }, 2000)
        }
      })
    })
  },
  // 更新 todo
  todoUpdate(request) {
    const todoId = this.data.post.todoId
    const classId = this.data.post.class.id
    Todo.updateTodo(todoId, request).then(res => {
      this.setData({
        'post.status': 0,
        'post.error': ''
      })
      Util.storageUpdate('todoList')    // 更新本地缓存
      app.globalData.todo[todoId].updated = true
      wx.redirectTo({url: `/pages/todo/detail/detail?todoId=${todoId}&classId=${classId}`})
    }).catch(error => {
      Util.toast('更新失败', 'error', {
        duration: 2000,
        complete() {
          setTimeout(() => {
            wx.redirectTo({url: `/pages/todo/detail/detail?todoId=${todoId}&classId=${classId}`})
          }, 2000)
        }
      })
    })
  },
  // 提交 todo
  onSubmit(e) {
    this.setData({ 'post.error': '' })
    const postData = this.data.post
    const userId = app.globalData.user.objectId

    const title = postData.title.trim()
    if (!title) return this.setData({ 'post.error': '你还没写要干啥呢!' })
    if (title.length < 5) return this.setData({ 'post.error': '多写几个字会死呀! o(╯□╰)o' })

    const content = postData.content.trim()
    const priority = Handle.getPriority(postData.important, postData.urgent)
    const now = new Date().getTime()
    const startAt = new Date(`${postData.dateTime.date.val[postData.dateTime.start.index]} ${postData.dateTime.start.time}`).getTime()
    const endAt = new Date(`${postData.dateTime.date.val[postData.dateTime.end.index]} ${postData.dateTime.end.time}`).getTime()
    if (startAt > endAt || (endAt - now) < 1000*60) return this.setData({ 'post.error': '还没开始就结束啦？' })

    let request = {
      creatorId: userId,
      creator: {
        "__type": "Pointer",
        "className": "_User",
        "objectId": userId
      },
      classId: postData.class.id,
      title,
      content,
      status: 0,
      startAt: {
        '__type': 'Date',
        'iso': new Date(startAt)
      },
      endAt: {
        '__type': 'Date',
        'iso': new Date(endAt)
      },
      priority,
      remind: postData.remind
    }
    this.setData({'post.status': 1})
    if (postData.action === 'post') {
      this.todoPost(request, e.detail.formId)
    } else {
      this.todoUpdate(request)
    }
  }
})