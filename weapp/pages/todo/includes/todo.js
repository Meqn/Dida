const app = getApp()
import Util from '../../../utils/util'
import Todo from '../../../utils/todo'
import Qdate from '../../../libs/date'
import {ARCHIVE} from './const'
/* 
try {
  const userId = app.globalData.user.objectId
} catch (error) {
  wx.navigateTo({url: '/pages/index/index'})
}
 */



/**
 * 发送模版消息[创建todo成功]
 * @param {[Obj]} todo todo信息
 * @param {[Str]} formId 模版消息授权码
 */
const todoMessage = function (todo, formId) {
  let postData = {
    "touser": app.globalData.user.openId,
    "template_id": "Ieb0x6A5o_mvuw6qfkw9fBl7Etjs3_Pc7d_U-G2HtiY",
    "page": `/pages/todo/detail/detail?todoId=${todo.objectId}&classId=${todo.classId}`,
    "form_id": formId,
    "data": {
      "keyword1": {
        "value": todo.title,
        "color": "#173177"
      },
      "keyword2": {
        "value": todo.content === '' ? '无' : todo.content
      },
      "keyword3": {
        "value": new Date(todo.startAt.iso).format('M月d日 hh:mm') + ' - ' + new Date(todo.endAt.iso).format('M月d日 hh:mm')
      },
      "keyword4": {
        "value": todo.creator.nickName
      },
      "keyword5": {
        "value": new Date(todo.createdAt).format('yyyy/MM/dd 周wCN hh:mm')
      }
    },
    "emphasis_keyword": ""
  }
  return new Promise((resolve, reject) => {
    Util.sendMessage(postData, {
      success(res) {
        resolve(res)
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

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
              wx.setStorage({ key: 'todoClass', data: result })
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
        Todo.getTodo(`?where={"creatorId":"${app.globalData.user.objectId}"}&order=endAt`, {
          success(res) {
            if (res.statusCode === 200) {
              const result = Object.assign({}, {
                results: res.data.results,
                updated: false
              })
              wx.setStorage({ key: 'todoList', data: result })
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

/**
 * 获取 todo 详情
 * @param {[Str]} id todo id
 */
const getTodo = function (id) {
  return new Promise((resolve, reject) => {
    Todo.getTodo(`/${id}?include=creator`, {
      success(res) {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          reject(res, '获取列表失败')
        }
      },
      fail(error) {
        reject(error, '网络繁忙')
      }
    })
  })
}

const editTodo = function (data = {}, payload = {}) {
  //
}

// 创建 todo分享
const postTodoFollow = function (todoId) {
  const request = {
    followerId: app.globalData.user.objectId,
    follower: {
      "__type": "Pointer",
      "className": "_User",
      "objectId": app.globalData.user.objectId
    },
    todoId: todoId,
    todo: {
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
        }
      }, fail(error) {
        reject(error, '网络繁忙')
      }
    })
  })
}

// 获取接受邀请Todo总数
const getFollowCount = function () {
  return new Promise((resolve, reject) => {
    try {
      const localFollow = wx.getStorageSync('todoFollowCount')
      if (localFollow) {
        resolve(localFollow)
      } else {
        const condition = `?where={"followerId":"${app.globalData.user.objectId}"}&count=1&limit=0`
        Todo.getTodoFollow(condition, {
          success(res) {
            if (res.statusCode === 200) {
              const result = { count: res.data.count }
              wx.setStorage({ key: 'todoFollowCount', data: result })
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

// 获取 todo 参加者
const getTodoFollow = function (todoId) {
  return new Promise((resolve, reject) => {
    Todo.getTodoFollow(`?where={"todoId":"${todoId}"}&include=follower`, {
      success(res) {
        if (res.statusCode === 200) {
          resolve(res.data.results)
        } else {
          reject(res, '获取数据失败')
        }
      },
      fail(error) {
        reject(error, '网络繁忙')
      }
    })
  })
}

// 归档数量
const getTodoArchive = function () {
  let _class = {}
  let _mode = {}

  const dt = Qdate.get()
  const now = dt.timestamp
  const t1 = new Date(dt.year, dt.month - 1, dt.day).getTime()
  const t2 = t1 + 1000 * 60 * 60 * 24

  return new Promise((resolve, reject) => {
    try {
      const localArchive = wx.getStorageSync('todoArchive') || null
      const classList = wx.getStorageSync('todoClass') || null
      const todoList = wx.getStorageSync('todoList') || null
      if (classList && todoList && localArchive && !localArchive.updated) {
        resolve({ classList, modeList: ARCHIVE, archive: localArchive })
      } else {
        Promise.all([getClass(), getAllTodo()]).then(res => {
          const CL = res[0].results, TL = res[1].results
          ARCHIVE.reduce((acc, v, k) => {
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
              const startAt = new Date(v.startAt.iso).getTime()
              const endAt = new Date(v.endAt.iso).getTime()

              if (endAt < now) {
                _mode.expired.push(v.objectId)
              } else {
                if (endAt > now && startAt < now) {
                  _mode.doing.push(v.objectId)
                }
                if ((endAt > t1 && endAt < t2) || (startAt > t1 && startAt < t2)) {
                  _mode.today.push(v.objectId)
                }
              }
            }
          }, 0)

          let _archive = { class: _class, mode: _mode, updated: false }
          wx.setStorage({ key: 'todoArchive', data: _archive })
          resolve({ classList: res[0], modeList: ARCHIVE, archive: _archive })
        }).catch(error => {
          reject(error, '获取列表失败')
        })
      }
    } catch (error) {
      reject(error, '获取缓存数据失败')
    }
  })
}

const todoArchive = function() {
  //
}



module.exports = {
  postClass,
  getClass,
  getAllTodo,
  getTodoArchive,
  postTodo,
  getTodo,
  postTodoFollow,
  getFollowCount,
  getTodoFollow,
  todoMessage
}