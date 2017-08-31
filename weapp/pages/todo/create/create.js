const app = getApp()
import Qdate from '../../../libs/date'
import Handle from './handle'
import { postTodo } from '../includes/todo'

let defaultTodoClass = {
  name: '生活',
  id: '599145618d6d810058a5a0fc'
}
// index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    action: 'post',
    post: {
      status: 0,
      error: '',
      title: '',
      content: '',
      urgent: false,        // 紧急: 2
      important: false,     // 重要: 1
      remind: true,
      priority: 0,
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      const { urgent, important, priority } = Handle.priorityStatus(2)
      const params = {
        action: 'put',
        post: {
          status: 0,
          urgent, important, priority,
          remind: true
        }
      }
      this.setData(params)
    } else {
      this.setData({
        action: 'post',
        'post.dateTime': {
          date: Handle.getDate(),
          start: Handle.setDate(null, 'start'),
          end: Handle.setDate(null, 'end')
        }
      })
      // 设置临时共享数据
      app.globalData.temp.todoClass = defaultTodoClass
    }
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
    this.setData({
      'post.class': app.globalData.temp.todoClass
    })
  },
  bindInput(e) {
    this.data.post[e.currentTarget.id] = e.detail.value
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
  onSubmit() {
    this.setData({ 'post.error': '' })
    const context = this
    const postData = this.data.post

    const title = postData.title.trim()
    if (!title) return this.setData({ 'post.error': '你还没写要干啥呢!' })
    if (title.length < 6) return this.setData({ 'post.error': '多写几个字会死呀! o(╯□╰)o' })

    const content = postData.content.trim()
    const priority = Handle.getPriority(postData.important, postData.urgent)
    const startAt = new Date(`${postData.dateTime.date.val[postData.dateTime.start.index]} ${postData.dateTime.start.time}`).getTime()
    const endAt = new Date(`${postData.dateTime.date.val[postData.dateTime.end.index]} ${postData.dateTime.end.time}`).getTime()
    if (startAt > endAt) return this.setData({ 'post.error': '还没开始就结束啦？' })

    let request = {
      creator: app.globalData.user.objectId,
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
    console.log('request : ', request)

    this.setData({
      'post.status': 1
    })
    postTodo(request, {
      success() {
        context.setData({
          'post.status': 0,
          'post.error': ''
        })
      },
      fail() {}
    })
  }
})