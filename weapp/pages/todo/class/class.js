const app = getApp()
import Todo from '../includes/todo'

// index.js
Page({

  /**
   * 页面的初始数据
   * class,mode
   */
  data: {
    status: 'loading',
    data: {
      class: [],
      mode: [],
      invite: 0,
      size: {}
    },
    posts: {
      status: 0,
      error: '',
      fields: {
        title: '',
        color: {
          index: 9,
          value: [
            { name: 'red' },
            { name: 'orange' },
            { name: 'yellow' },
            { name: 'green' },
            { name: 'blue' },
            { name: 'indigo' },
            { name: 'purple' },
            { name: 'pink' },
            { name: 'teal' },
            { name: 'brown' }
          ]
        }
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const ctx = this
    Todo.todoArchive(data => {
      this.setData({
        status: 'end',
        'data.class': data.class,
        'data.mode': data.mode,
        'data.size': data.size,
      })
    })
    // 被邀请
    Todo.getFollowCount().then(data => this.setData({'data.invite': data}))

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

  },
  // 显示创建列表窗口
  createClass() {
    this.setData({
      status: 'add'
    })
  },
  // 显示创建列表窗口
  modalClose() {
    this.setData({
      status: 'end',
      'posts.status': 0,
      'posts.error': ''
    })
  },
  // 创建列表
  submitClass() {
    const context = this
    const posts = this.data.posts
    const title = posts.fields.title.trim()
    const color = posts.fields.color.value[posts.fields.color.index]['name']
    
    if (!title) return this.setData({'posts.error': '名称不能为空'})
    if (app.globalData.user.level < 20) {
      this.modalClose()
      return wx.showModal({
        title: '',
        content: '权限不足,无法创建',
        showCancel: false,
      })
    }

    this.setData({
      'posts.status': 1,
      'posts.error': ''
    })
    Todo.postClass({title, color}).then(res => {
      this.setData({
        status: 'end',
        'posts.status': 0,
        'posts.error': '',
        'posts.fields.title': ''
      })
    }).catch(err => {
      this.setData({
        'posts.status': 0,
        'posts.error': err.errorText
      })
    })
  },
  // 获取列表名称
  bindClassTitle(e) {
    this.data.posts.fields.title = e.detail.value
  },
  // 获取列表颜色
  selectColor(event) {
    this.setData({
      'posts.fields.color.index': event.currentTarget.dataset.index
    })
  }
})