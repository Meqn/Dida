const app = getApp()
import Swipe from '../../../libs/scripts/swipe'

let TouchXY = {x1: 0, x2: 0, y1: 0, y2: 0}

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
  },
  quit(e) {
    wx.showModal({
      title: '',
      content: '确定要退出？',
      success(res) {
        if (res.confirm) {
          console.log('已经退出')
        } else {
          console.log('不要退出')
        }
      }
    })
  }
})