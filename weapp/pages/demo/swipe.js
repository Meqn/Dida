import Swipe from '../../libs/swipe'

let TouchXY = {x1: 0, x2: 0, y1: 0, y2: 0}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let items = []
    for (var i = 0; i < 10; i++) {
      items[i] = {
        text: '左滑动内容但是啦放假撒到了发生；的发生的发生的李开复受到了粉丝多了',
        isMove: false,
        checked: false
      }
    }
    this.setData({
      list: items
    })
  },
  onTap(e) {
    console.log('点击事件： ', e.currentTarget)
  },
  onTouchStart(e) {
    let touch = e.changedTouches[0]
    TouchXY.x1 = touch.pageX
    TouchXY.y1 = touch.pageY

    this.data.list.forEach(function(v, k) {
      if (v.isMove) {
        v.isMove = false
      }
    });
    setTimeout(() => {
      this.setData({list: this.data.list})
    }, 250)
  },
  onTouchEnd(e) {
    const context = this
    const index = e.currentTarget.dataset.index
    let touch = e.changedTouches[0]
    TouchXY.x2 = touch.pageX
    TouchXY.y2 = touch.pageY

    Swipe(TouchXY, {
      swipeLeft(e) {
        let params = {}
        params['list['+ index +'].isMove'] = true
        context.setData(params)
      }
    })
  },
  markChecked(e) {
    const index = e.currentTarget.dataset.index
    const params = {}
    params['list['+ index +'].checked'] = !this.data.list[index].checked
    this.setData(params)
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

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})