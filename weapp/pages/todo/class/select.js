const app = getApp()
import TodoClass from '../includes/todo'
Page({
  data: {
    status: 'loading',
    currentClass: 0,
    classes: []
  },

  onLoad: function (options) {
    console.log('app.globalData : ', app.globalData.temp)
    if (!app.globalData.temp.todoClass.id) return wx.navigateBack()

    TodoClass.getClass().then(res => {
      this.setData({
        status: 'success',
        currentClass: app.globalData.temp.todoClass.id,
        classes: res
      })
    }).catch((error, msg) => {
      console.error(msg)
    })
  },
  onSelect(e) {
    let ds = e.currentTarget.dataset
    console.log(ds)
    app.globalData.temp.todoClass = {
      id: ds.id,
      name: ds.name
    }
    wx.navigateBack()
  }
})