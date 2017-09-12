const app = getApp()
import {COLOR} from '../includes/const'
import Todo from '../includes/todo'

let todoId

Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: 'loading',
    bgColor: 'blue',
    todo: {   // 防止报错，给默认值
      creator: { avatarUrl: 'http://static.mengqing.org/dot.png' },
      follower: []
    },
    isCreator: false,
    isFollow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opts) {

    if (!opts.todoId) {
      return wx.showModal({
        title: '',
        content: '访问路径错误',
        showCancel: false,
        confirmColor: COLOR.blue,
        complete() {
          wx.switchTab({ url: '/pages/todo/index' })
        }
      })
    }
    todoId = opts.todoId
    this.setBarColor(opts.classId)
    this.getTodoDetail(todoId)
  },
  onReady: function () {
  },
  onShow: function () {
  },
  onShareAppMessage () {
    return {
      title: `好友 ${app.globalData.user.nickName} 邀请你加入：`,
      path: `/pages/todo/detail/detail?todoId=${todoId}&classId=${this.data.todo.classId}`
    }
  },
  onJoin(e) {
    let currentTodo = app.globalData.todo[todoId]
    Todo.postTodoFollow(todoId).then(res => {
      currentTodo.updated = true
      currentTodo.follower.push(app.globalData.user)
      this.setData({
        todo: currentTodo,
        isFollow: true
      })
      Todo.todoMessage(currentTodo, e.detail.formId)
    }).catch(err => {
      wx.showModal({
        title: '',
        content: '加入失败',
        showCancel: false,
        confirmColor: COLOR.blue,
        complete() {
          wx.switchTab({ url: '/pages/todo/index' })
        }
      })
    })
  },
  setBarColor(id) {
    if (!id) {
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: COLOR.blue
      })
    }
    Todo.getClass().then(res => {
      let bgColor = 'blue'
      res.results.reduce((acc, v, k) => {
        if (v['objectId'] === id) {
          return bgColor = v.color
        }
      }, 0)
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: COLOR[bgColor]
      })
      this.setData({ bgColor })
    })
  },
  getTodoDetail(id) {
    const localTodo = app.globalData.todo[id]
    const me = app.globalData.user['objectId']
    let isFollow = false
    if (localTodo && !localTodo.updated) {
      this.setData({
        status: 'end',
        todo: localTodo,
        isCreator: localTodo.creatorId === me
      })
    } else {
      Todo.getTodo(id).then(res => {
        const result = Object.assign({}, res, {
          startTime: new Date(res.startAt.iso).format('M月d 周wCN hh:mm'),
          endTime: new Date(res.endAt.iso).format('M月d 周wCN hh:mm'),
          follower: [res.creator],
          updated: false
        })
        this.setData({
          status: 'end',
          todo: result,
          isCreator: res.creatorId === me
        })
        Todo.getTodoFollow(id).then(user => {
          if (user.length > 0) {
            user.reduce((acc, v, k) => {
              result.follower.push(v.follower)
              if(v.followerId === me) isFollow = true
            }, 0)
            this.setData({
              todo: result,
              isFollow: isFollow
            })
          }
          app.globalData.todo[id] = result
        })
      }).catch((err, msg) => {
        console.log(err, msg)
      })
    } 
  }
})