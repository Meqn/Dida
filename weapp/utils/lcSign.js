import md5 from '../libs/md5.min'
import config from '../config'

const keySign = function (type = 'app') {
  const _type = (type && type === 'master') ? 'masterKey' : 'appKey'
  const timestamp = Number(new Date())
  const sign = md5(timestamp + config[_type])
  return {
    sign,
    timestamp
  }
}

module.exports = keySign
