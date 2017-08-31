import Swipe from '../../libs/swipe'

let touchXY = {
  x1: 0,
  x2: 0,
  y1: 0,
  y2: 0
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
  
  },
  onTouchStart(e) {
    let target = e.changedTouches[0]
    touchXY.x1 = target.pageX
    touchXY.y1 = target.pageY
  },
  onTouchEnd(e) {
    let target = e.changedTouches[0]
    touchXY.x2 = target.pageX
    touchXY.y2 = target.pageY

    Swipe(touchXY, {
      swipeLeft(n) {
        console.log(`向左滑动了 ${n} 像素`)
      },
      swipeRight(n) {
        console.log(`向右滑动了 ${n} 像素`)
      },
      swipeUp(n) {
        console.log(`向上滑动了 ${n} 像素`)
      },
      swipeDown(n) {
        console.log(`向下滑动了 ${n} 像素`)
      }
    })
  }
})