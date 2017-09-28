const app = getApp()
import Swipe from '../../../libs/scripts/swipe'
import Todo from '../includes/todo'
import Util from '../../../utils/util'

let TouchXY = {x1: 0, x2: 0, y1: 0, y2: 0}
let TodoId

Page({
  data: {
    users: [],
    isCreator: false,
    isFollow: false
  },
  onLoad: function (opts) {
    if (!opts.todoId) {
      return wx.showModal({
        title: '',
        content: '访问路径错误',
        showCancel: false,
        complete() {
          wx.switchTab({ url: '/pages/todo/index' })
        }
      })
    }
    TodoId = opts.todoId
    this.getUser(opts.todoId)
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
  onTouchStart(e) {
    let eTouch = e.changedTouches[0]
    TouchXY.x1 = eTouch.pageX
    TouchXY.y1 = eTouch.pageY

    this.data.users.reduce((acc, v, k) => {
      if (v.isMove) v.isMove = false
    }, 0);
    setTimeout(() => {
      this.setData({users: this.data.users})
    }, 100)
  },
  onTouchMove(e) {
    console.log('onTouchMove : ', e)
  },
  onTouchEnd(e) {
    const ctx = this
    const index = e.currentTarget.dataset.index
    let eTouch = e.changedTouches[0]
    TouchXY.x2 = eTouch.pageX
    TouchXY.y2 = eTouch.pageY

    Swipe(TouchXY, {
      swipeLeft() {
        let params = {}
        params['users['+ index +'].isMove'] = true
        ctx.setData(params)
      }
    })
  },
  onQuit(e) {
    wx.showModal({
      title: '',
      content: '确定要退出？',
      success(res) {
        if (res.confirm) {
          Todo.getFollowId(TodoId, app.globalData.user['objectId']).then(follows => {
            if (follows.length > 0) {
              Todo.deleteFollow(follows[0]['objectId']).then(data => {
                Util.globalDataUpdate(app.globalData.todo[TodoId])
                Util.globalDataUpdate(app.globalData.todoFollow)
                Util.globalDataUpdate(app.globalData.todoFollowCount)
                Util.toast('退出成功', 'success')
                setTimeout(function() {
                  wx.switchTab({url: '/pages/todo/index'})
                }, 1500);
              }).catch(error => {
                Util.toast('退出失败', 'error')
                setTimeout(function() {
                  wx.switchTab({url: '/pages/todo/index'})
                }, 1500);
              })
            }
          })
        }
      }
    })
  },
  getUser(id) {
    if (app.globalData.todo[id]) {
      const _todo = app.globalData.todo[id]
      const me = app.globalData.user['objectId']
      _todo['follower'].reduce((acc, v, k) => {
        v.isMove = false
        if (v.objectId === me) this.data.isFollow = true
      }, 0)
      this.setData({
        users: _todo['follower'],
        isFollow: this.data.isFollow,
        isCreator: _todo.creatorId === me
      })
    } else {
      wx.redirectTo({
        url: '/pages/todo/detail/detail?todoId='+id
      })
    }
  }
})