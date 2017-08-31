const app = getApp()
import TodoClass from '../includes/todo'

// index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: 'loading',
    classes: [],
    inbox: [
      {
        type: 'today',
        title: '今天',
        count: 21,
        icon: 'calendar',
        color: ''
      }, {
        type: 'expired',
        title: '已过期',
        count: 21,
        icon: 'time',
        color: 'red'
      }, {
        type: 'do',
        title: '进行中',
        count: 21,
        icon: 'waiting',
        color: 'blue'
      }, {
        type: 'done',
        title: '已完成',
        count: 21,
        icon: 'done',
        color: 'green'
      }
    ],
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
    TodoClass.getClass().then(res => {
      console.log(res)
      this.setData({
        status: 'end',
        classes: res.results
      })
    }).catch((e, msg) => {
      console.error(msg)
    })

    TodoClass.getAllTodo().then(res => console.log('getAllTodo : ', res))

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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

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
      wx.showModal({
        title: '',
        content: '权限不足,无法创建',
        showCancel: false,
      })
      return
    }

    this.setData({
      'posts.status': 1,
      'posts.error': ''
    })
    TodoClass.postClass({ title, color }, {
      success(res) {
        context.setData({
          status: 'end',
          'posts.status': 0,
          'posts.error': '',
          'posts.fields.title': ''
        })
      },
      fail(error, msg) {
        context.setData({
          'posts.status': 0,
          'posts.error': msg
        })
      }
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