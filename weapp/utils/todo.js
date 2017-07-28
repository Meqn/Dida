const app = getApp()
import { xhr, setACL } from './util'

module.exports = {
  getTodo({ url = '/Todo', data = {}, success, fail }) {
    xhr({
      url,
      data,
      success,
      fail
    })
  },
  addTodo({ url = '/Todo?fetchWhenSave=true', data = {}, success, fail }) {
    const userId = app.globalData.user['objectId']
    const ACL = setACL({
      user: [userId],
      role: ['admin']
    })
    let request = Object.assign({}, { ACL, user: userId }, data)
    xhr({
      url,
      method: 'POST',
      data: JSON.stringify(request),
      success,
      fail
    })
  }
}


