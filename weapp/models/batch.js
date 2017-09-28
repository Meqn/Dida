const app = getApp()
import { Request, ACL } from '../utils/lean'
import RequestUrl from './url'

// 批量删除
module.exports = function(requests) {
  return new Promise((resolve, reject) => {
    Request({
      url: RequestUrl.batch.url,
      method: 'POST',
      header: {
        'X-LC-Session': app.globalData.user['sessionToken']
      },
      data: {
        "requests": requests
      },
      success(res) {
        if (res.statusCode === 200) {
          resolve(res)
        } else {
          reject(res)
        }
      },
      fail(error) {
        reject(error)
      }
    })
  })
}
