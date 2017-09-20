import RequestUrl from './url'

/**
 * 发送模版消息
 */
function Notice(data, { success, fail }) {
  wx.request({
    url: RequestUrl.weapp.notice,
    method: 'POST',
    data: data,
    success,
    fail
  })
}

module.exports = Notice