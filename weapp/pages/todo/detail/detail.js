const app = getApp()
import Util from '../../../utils/util'
import {COLOR} from '../includes/const'
import Todo from '../includes/todo'
import { ArchiveState } from '../includes/archive'

let TodoId

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
    TodoId = opts.todoId
    this.setBarColor(opts.classId)
  },
  onReady: function () {
  },
  onShow: function () {
    this.todoDetail(TodoId)
  },
  onShareAppMessage () {
    return {
      title: `好友 ${app.globalData.user.nickName} 邀请你加入：`,
      path: `/pages/todo/detail/detail?todoId=${TodoId}&classId=${this.data.todo.classId}`
    }
  },
  onEdit(e) {
    const _status = ArchiveState(this.data.todo)
    if (_status === 'done' || _status === 'expired') {
      return wx.showModal({
        content: '过期清单,无法修改',
        showCancel: false
      })
    }
    wx.redirectTo({
      url: '/pages/todo/create/create?todoId='+ this.data.todo.objectId
    })
  },
  onJoin(e) {
    let _todo = app.globalData.todo[TodoId]
    let _follow = app.globalData.todoFollow
    let _followCount = app.globalData.todoFollowCount

    Todo.postTodoFollow(TodoId, _todo.creatorId).then(res => {
      if(_follow) _follow.updated = true
      if(_followCount) _followCount.updated = true
      
      _todo.updated = true
      _todo.follower.push(app.globalData.user)
      this.setData({
        todo: _todo,
        isFollow: true
      })
      Todo.TodoMessage(_todo, e.detail.formId, 'share')     // 推送通知
    }).catch(err => {
      wx.showModal({
        content: '加入失败',
        showCancel: false,
        complete() {
          wx.switchTab({ url: '/pages/todo/index' })
        }
      })
    })
  },
  setBarColor(classId) {
    if (classId) {
      Todo.getClass().then(res => {
        let bgColor = 'blue'
        res.reduce((acc, v) => {
          if(v.objectId === classId) bgColor = v.color
        }, 0)
        wx.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: COLOR[bgColor]
        })
        this.setData({ bgColor })
      })
    } else {
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: COLOR.blue
      })
    }
  },
  todoDetail(id) {
    Todo.getTodoDetail(id).then(data => {
      const me = app.globalData.user.objectId
      data.follower.reduce((acc, v) => {
        if(v.objectId === me) this.data.isFollow = true
      }, 0)
      data.startTime = new Date(data.startAt.iso).format('M月d 周wCN hh:mm')
      data.endTime = new Date(data.endAt.iso).format('M月d 周wCN hh:mm')

      this.setData({
        status: 'end',
        todo: data,
        todoClass: app.globalData.todoClass,
        isCreator: data.creatorId === me,
        isFollow: this.data.isFollow
      })
    }).catch(error => {
      app.globalData.temp.tip = {
        type: 'warn',
        title: '加载失败',
        text: '网络错误或数据不存在(或已被删除)',
        btn: [{
          text: '返回',
          type: 'primary',
          callback(e) {
            wx.switchTab({url: '/pages/todo/index'})
          }
        }]
      }
      wx.navigateTo({url: '/pages/tip/tip'})
    })
  }
})