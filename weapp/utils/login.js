// import AV from '../libs/av-weapp-min'
const app = getApp()

function wxLogin() {
  return new Promise((resolve, reject) => {
    AV.User.loginWithWeapp().then(res => {
      resolve(res.toJSON())
    }).catch(error => {
      reject(error)
    })
  })
}

function saveUser() {
  return new Promise((resolve, reject) => {
    wx.getUserInfo({
      success(user) {
        AV.User.current().set(user.userInfo).save().then(data => {
          resolve(data.toJSON())
        }).catch(error => {
          reject(error)
        })
      },
      fail(error) {
        reject(error)
      }
    })
  })
}

const login = function ({ success = null, fail = null }) {
  const USERINFO = app.globalData.user
  if (USERINFO) {
    typeof success == "function" && success(USERINFO)
  } else {
    wxLogin().then(data => {
      if(data['nickName']) {
        typeof success == "function" && success(data)
      } else {
        saveUser().then(user => {
          typeof success == "function" && success(user)
        }).catch(error => {
          typeof fail == "function" && fail(error)
        })
      }
    }).catch(error => {
      typeof fail == "function" && fail(error)
    })
  }
}

module.exports = login