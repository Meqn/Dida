const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    response: {}

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
  onSend(e) {
    const ctx = this
    // return console.log(e, e.detail.formId)


    let postData = {
      "touser": app.globalData.user.openId,
      "template_id": "rkAZZ-EzCyRIuz5YvlYWl7AcqkhAp2PqgxUQ3RbX-vI",
      "page": "/pages/todo/index",
      "form_id": e.detail.formId,
      "data": {
        "keyword1": {
          "value": "2015年01月05日",
          "color": "#173177"
        },
        "keyword2": {
          "value": "今天开始或结束的事情",
        },
        "keyword3": {
          "value": "粤海喜来登酒店",
        },
        "keyword4": {
          "value": "广州市天河区天河路208号",
        },
        "keyword5": {
          "value": "广州市天河区天河路208号",
        },
        "keyword6": {
          "value": "广州市天河区天河路208号",
        },
        "keyword7": {
          "value": "广州市天河区天河路208号",
        }
      },
      "emphasis_keyword": ""
    }
    wx.request({
      url: 'https://api.jiabe.com/weapp/notice',
      method: 'POST',
      data: postData,
      success(res) {
        console.log('成功： ', res)
      },
      fail(res) {
        console.log('失败： ', res)
      }
    })
  }
})