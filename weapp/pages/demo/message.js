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

    let postData = {
      "touser": app.globalData.user.openId,
      "template_id": "f-MLtxrupqo2xhGidxPjlD5-9o7MQ6mY_KDLV_eqFHc",
      "page": '/pages/todo/index',
      "form_id": e.detail.formId,
      "data": {
        "keyword1": {
          "value": '是短发阿水发生的粉；离开时地方撒地方发 撒地方撒地方撒地方撒地方啊',
          "color": "#173177"
        },
        "keyword2": {
          "value": new Date('2017/09/10').format('yyyy/MM/dd 周wCN hh:mm')
        },
        "keyword3": {
          "value": '该任务已完成✅，请关闭'
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