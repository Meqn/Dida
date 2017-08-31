const app = getApp()
import Util from '../../../utils/util'
import Todo from '../../../utils/todo'


const postClass = function ({ title, color }, { success, fail }) {
  const userId = app.globalData.user.objectId
  const ACL = Util.setACL({
    user: [userId]
  })
  Todo.addTodoClass({ title, color, owner: userId, ACL }, {
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

const getClass = function () {
  return new Promise((resolve, reject) => {
    try {
      const localClass = wx.getStorageSync('todoClass')
      if (localClass && !localClass.updated) {
        resolve(localClass)
      } else {
        const where = 'where={"$or":[{"owner":"0"},{"owner":"' + app.globalData.user.objectId + '"}]}'
        const order = 'order=-orderBy,createdAt'
        const condition = where + '&' + order
        
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

const getAllTodo = function () {
  return new Promise((resolve, reject) => {
    try {
      const localTodo = wx.getStorageSync('todoList')
      if (localTodo && !localTodo.updated) {
        resolve(localTodo)
      } else {
        Todo.getTodos('where={"creator":"' + app.globalData.user.objectId + '"}', {
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
  editTodo
}





module.exports = {
  postClass,
  getClass,
  getAllTodo,
  postTodo
}