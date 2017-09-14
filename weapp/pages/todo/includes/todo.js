const app = getApp()
import Util from '../../../utils/util'
import Todo from '../../../utils/todo'
import Qdate from '../../../libs/date'
import { ALL, ARCHIVE } from './const'
import { ArchiveState, ArchiveDate } from './archive'
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
const TodoMessage = function (todo, formId, type = 'share') {
  let postData = {
    "touser": app.globalData.user.openId,
    "template_id": type === 'create' ? "Ieb0x6A5o_mvuw6qfkw9fBl7Etjs3_Pc7d_U-G2HtiY" : "PAnr7AwjZOBLieNAQb1t2g2wN9G_X0UZHTGbPIH9T9Y",
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
        "value": type === 'create' ? app.globalData.user.nickName : todo.creator.nickName
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
const postTodo = function (data = {}) {
  return new Promise((resolve, reject) => {
    Todo.addTodo(data, {
      success(res) {
        if (res.statusCode === 201) {
          resolve(res.data)
        } else {
          reject(Util.setError(res, '清单创建失败'))
        }
      },
      fail(error) {
        reject(Util.setError(error, '清单创建失败'))
      }
    })
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

/**
 * 更新 todo
 * @param {[Str]} todoId todo id
 * @param {[Obj]} data 更新的数据
 */
const updateTodo = function (todoId, data = {}) {
  return new Promise((resolve, reject) => {
    Todo.updateTodo(`/${todoId}`, data, {
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

/**
 * 加入 todo邀请
 * @param {[Str]} todoId todo id
 * @param {[Str]} creatorId todo创建者id
 */
const postTodoFollow = function (todoId, creatorId) {
  const userId = app.globalData.user.objectId
  const request = {
    followerId: userId,
    follower: {
      "__type": "Pointer",
      "className": "_User",
      "objectId": userId
    },
    todoId: todoId,
    todo: {
      "__type": "Pointer",
      "className": "Todo",
      "objectId": todoId
    },
    'ACL': Util.setACL({user: [userId, creatorId]})
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
/**
 * 获取邀请加入的todo
 */
const getFollow = function () {
  return new Promise((resolve, reject) => {
    const localFollow = app.globalData.todoFollow
    if (localFollow && !localFollow.updated) {
      resolve(localFollow.results)
    } else {
      Todo.getTodoFollow(`?where={"followerId":"${app.globalData.user.objectId}"}&include=todo&keys=todo`, {
        success(res) {
          if (res.statusCode === 200) {
            app.globalData.todoFollow = {results: res.data.results, updated: false}
            resolve(res.data.results)
          } else {
            reject(Util.setError(res, '获取数据失败'))
          }
        },
        fail(error) {
          reject(Util.setError(error, '网络繁忙'))
        }
      })
    } 
  })
}

/**
 * 获取接受邀请Todo总数
 */
const getFollowCount = function () {
  return new Promise((resolve, reject) => {
    const localFollow = app.globalData.todoFollowCount
    if (localFollow && !localFollow.updated) {
      resolve(localFollow.count)
    } else {
      const condition = `?where={"followerId":"${app.globalData.user.objectId}"}&count=1&limit=0`
      Todo.getTodoFollow(condition, {
        success(res) {
          if (res.statusCode === 200) {
            app.globalData.todoFollowCount = { count: res.data.count, updated: false }
            resolve(res.data.count)
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
  })
}

/**
 * 获取 todo 参加者
 */
const getFollower = function (todoId) {
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

/**
 * 归档信息
 */
const todoArchive = function (cb) {
  Promise.all([getClass(), getAllTodo()]).then(data => {
    const _classList = data[0].results, _todoList = data[1].results
    const _class = {}, _mode = {}

    const dt = new Date()
    const now = dt.getTime()
    const dayStart = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()).getTime()
    const dayEnd = dayStart + 1000 * 60 * 60 * 24

    ARCHIVE.reduce((acc, v, k) => {
      _mode[v.type] = []
    }, 0)
    _classList.reduce((acc, v, k) => {
      _class[v.objectId] = []
    }, 0)
    _todoList.reduce((acc, v, k) => {
      const _state = ArchiveState(v, now), _today = ArchiveDate(v, { dayStart, dayEnd })
      _class[v.classId].push(v)             // 分类数量
      _mode[_state].push(v)                 // 状态数量
      if (_today) _mode['today'].push(v)    // 今日数量
    }, 0)

    const result = {
      class: _classList,
      todo: _todoList,
      mode: ARCHIVE,
      size: Object.assign({}, _class, _mode)
    }
    typeof cb === 'function' && cb(result)
  })
}

/**
 * 获取某天的 Todo [包含刚开始或要结束的]
 * @param {[Arr]} todo 所有todo列表
 * @param {[Date]} date 当前日期
 */
const getTodoOfDate = function (todo, date) {
  const dt = Qdate.toDate(date)
  const dayStart = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()).getTime()
  const dayEnd = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate() + 1).getTime()

  return todo.reduce((acc, v, k) => {
    if (ArchiveDate(v, {dayStart, dayEnd})) acc.push(v)
    return acc
  }, [])
}

/**
 * 根据完成状态分类Todo
 * @param {[Arr]} todo Todo列表
 */
const getTodoOfState = function (todo) {
  let ret = {}
  ALL.state.reduce((acc, v) => { ret[v.type] = [] }, 0)
  if (todo instanceof Array && todo.length > 0) {
    todo.reduce((acc, v) => {
      ret[ArchiveState(v)].push(v)
    }, 0)
  }
  return ret
}

module.exports = {
  postClass,
  getClass,
  getAllTodo,
  todoArchive,
  postTodo,
  getTodo,
  updateTodo,
  postTodoFollow,
  getFollowCount,
  getFollow,
  getFollower,
  TodoMessage,
  getTodoOfDate,
  getTodoOfState
}