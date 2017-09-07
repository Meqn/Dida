const app = getApp()
import Util from '../../../utils/util'
import Todo from '../../../utils/todo'
import Qdate from '../../../libs/date'
import ModeList from './archive'
/* 
try {
  const userId = app.globalData.user.objectId
} catch (error) {
  wx.navigateTo({url: '/pages/index/index'})
}
 */
/**
 * 创建 Todo Class
 */
const postClass = function ({ title, color }, { success, fail }) {
  Todo.addTodoClass({ title, color, owner: app.globalData.user.objectId }, {
    success(res) {
      if (res.statusCode === 201) {
        typeof success === 'function' && success(res)
      } else {
        typeof fail === 'function' && fail(res, '列表添加失败')
        console.error(res)
      }
    }, fail(error) {
      typeof fail === 'function' && fail(error, '网络繁忙')
      console.error(error)
    }
  })
}
/**
 * 获取 Todo Class
 */
const getClass = function () {
  return new Promise((resolve, reject) => {
    try {
      const localClass = wx.getStorageSync('todoClass') || null
      if (localClass && !localClass.updated) {
        resolve(localClass)
      } else {
        const condition = `?where={"$or":[{"owner":"0"},{"owner":"${app.globalData.user.objectId}"}]}&order=-orderBy,createdAt`
        
        Todo.getTodoClass(condition, {
          success(res) {
            if (res.statusCode === 200) {
              let _classes = []
              res.data.results.forEach(function (v, k) {
                let { objectId, title, icon, color, owner } = v
                if (!icon) icon = 'dot'
                _classes[k] = { objectId, title, icon, color, owner, count: 0 }
              })
              const result = Object.assign({}, {
                results: _classes,
                updated: false
              })
              wx.setStorage({key: 'todoClass', data: result})
              resolve(result)
            } else {
              reject(res, '获取列表失败')
            }
          },
          fail(error) {
            console.error(error)
            reject(error, '网络繁忙')
          }
        })
      }
    } catch (error) {
      reject(error, '获取缓存数据失败')
    }
  })
}
/**
 * 获取所有 Todo
 */
const getAllTodo = function () {
  return new Promise((resolve, reject) => {
    try {
      const localTodo = wx.getStorageSync('todoList') || null
      if (localTodo && !localTodo.updated) {
        resolve(localTodo)
      } else {
        Todo.getTodo(`?where={"creator":"${app.globalData.user.objectId}"}&order=endAt,-createAt`, {
          success(res) {
            if (res.statusCode === 200) {
              const result = Object.assign({}, {
                results: res.data.results,
                updated: false
              })
              wx.setStorage({key: 'todoList', data: result})
              resolve(result)
            } else {
              reject(res, '获取列表失败')
            }
          },
          fail(error) {
            console.error(error)
            reject(error, '网络繁忙')
          }
        })
      }
    } catch (error) {
      reject(error, '获取缓存数据失败')
    }
  })
}

/**
 * 创建 Todo
 */
const postTodo = function (data = {}, payload = {}) {
  Todo.addTodo(data, {
    success(res) {
      console.log(res)
      if (res.statusCode === 201) {
        typeof payload.success === 'function' && payload.success(res)
      } else {
        typeof payload.fail === 'function' && payload.fail(error, '清单创建失败')
      }
    }, fail(error) {
      console.error(error)
      typeof payload.fail === 'function' && payload.fail(error, '网络繁忙')
    }
  })
}

const editTodo = function (data = {}, payload = {}) {
  //
}
// 创建 todo分享
const postTodoFollow = function(todoId) {
  const request = {
    follower: app.globalData.user.objectId,
    todoId: {
      "__type": "Pointer",
      "className": "Todo",
      "objectId": todoId
    }
  }
  return new Promise((resolve, reject) => {
    Todo.addTodoFollow(request, {
      success(res) {
        if (res.statusCode === 201) {
          resolve(res)
        } else {
          reject(res, '列表添加失败')
          console.error(res)
        }
      }, fail(error) {
        reject(error, '网络繁忙')
        console.error(error)
      }
    })
  })
}

// 获取接受邀请Todo总数
const getFollowCount = function() {
  return new Promise((resolve, reject) => {
    try {
      const localFollow = wx.getStorageSync('todoFollowCount')
      if (localFollow) {
        resolve(localFollow)
      } else {
        const condition = `?where={"follower":"${app.globalData.user.objectId}"}&count=1&limit=0`
        Todo.getTodoFollow(condition, {
          success(res) {
            if (res.statusCode === 200) {
              const result = {count: res.data.count}
              wx.setStorage({key: 'todoFollowCount', data: result})
              resolve(result)
            } else {
              reject(res, '获取列表失败')
            }
          },
          fail(error) {
            console.error(error)
            reject(error, '网络繁忙')
          }
        })
      }
    } catch (error) {
      reject(error, '获取缓存数据失败')
    }
  })
}

// 归档数量
const getTodoArchive = function() {
  let _class = {}
  let _mode = {}
  return new Promise((resolve, reject) => {
    try {
      const localArchive = wx.getStorageSync('todoArchive') || null
      const classList = wx.getStorageSync('todoClass') || null
      const todoList = wx.getStorageSync('todoList') || null
      if (classList && todoList && localArchive && !localArchive.updated) {
        resolve({classList, modeList: ModeList.mode, archive: localArchive})
      } else {
        Promise.all([getClass(), getAllTodo()]).then(res => {
          const CL = res[0].results, TL = res[1].results
          ModeList.mode.reduce((acc, v, k) => {
            _mode[v.type] = []
          }, 0)
          CL.reduce((acc, v, k) => {
            _class[v.objectId] = []
          }, 0)
          TL.reduce((acc, v, k) => {
            // 分类的数量
            _class[v.classId].push(v.objectId)
            // 归档的数量
            if (v.doneAt) {
              _mode.done.push(v.objectId)
            } else {
              const dt = Qdate.get()
              const now = dt.timestamp,
                startAt = new Date(v.startAt.iso).getTime(),
                endAt = new Date(v.endAt.iso).getTime()
              const t1 = new Date(dt.year, dt.month - 1, dt.day).getTime()
              const t2 = t1 + 1000 * 60 * 60 * 24

              if(endAt < now) {
                _mode.expired.push(v.objectId)
              } else {
                if (endAt > now && startAt < now) {
                  _mode.do.push(v.objectId)
                }
                if ((endAt > t1 && endAt < t2) || (startAt > t1 && startAt < t2)) {
                  _mode.today.push(v.objectId)
                }
              }
            }
          }, 0)

          let _archive = {class: _class, mode: _mode, updated: false}
          wx.setStorage({key: 'todoArchive', data: _archive})
          resolve({classList: res[0], modeList: ModeList.mode, archive: _archive})
        }).catch(error => {
          reject(error, '获取列表失败')
        })
      }
    } catch (error) {
      reject(error, '获取缓存数据失败')
    }
  })
}



module.exports = {
  postClass,
  getClass,
  getAllTodo,
  getTodoArchive,
  postTodo,
  getFollowCount
}