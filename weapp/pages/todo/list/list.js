const app = getApp()

Page({
  data: {
    users: []
  },
  onLoad: function () {
    let lists = []
    for (let i = 0; i < 8; i++) {
      lists[i] = {
        title: '这是一个任务，我的第一件事还没有做呢？',
        time: i+ '小时后',
        color: 'red',
        priority: 2,
      }
    }
    this.setData({todoList: lists})
  },

  onReady: function () {
  }
})