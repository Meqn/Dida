//index.js
//获取应用实例
var app = getApp()
/* import AV from '../../libs/av-weapp-min.js'
import Utils from '../../utils/util'
import { wxLogin } from '../../utils/user'
import { getTodo, addTodo } from '../../utils/todo' */


Page({
  data: {
    motto: 'Hello World',
    userInfo: {}
  },
  onLoad: function () {
    console.log('this data : ', this.motto)
   /*  AV.User.loginWithWeapp().then(user => {
      this.setData({
        userInfo: user.toJSON()
      })
      console.log('loginWithWeapp : ', user.toJSON())
    }).catch(err => {
      console.error('loginWithWeapp error : ', err)
    }) */
  },
  getinfo(e) {
    console.log(e)
  },
  setBorn0() {
    const query = new AV.Query('_user')
    query.get(app.globalData.user['objectId']).then(res => console.log(res.toJSON()))
  },
  setBorn2() {
    const request = {
      bornAt: '2017-12-21 22:30'
    }
    AV.User.current().set(request).save().then(res => {
      console.log('设置出生年月： ', res)
    })
  },
  setBorn3() {
    const query = new AV.Query('todo')
    query.find().then(res => {
      console.log('查询用户：', res[0].toJSON())
    })
  },
  setBorn() {
  }

})
