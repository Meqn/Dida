const app = getApp()
import Util from './util'

const TodoUrl = '/classes/Todo'
const todoClassUrl = '/classes/TodoClass'
const todoFollowUrl = '/classes/TodoFollow'

const addTodoClass = function (data = {}, { success, fail }) {
  Util.xhr({
    url: todoClassUrl + '?fetchWhenSave=true',
    method: 'POST',
    data: Object.assign({}, data, {
      'ACL': Util.setACL({user: [app.globalData.user.objectId]})
    }),
    success,
    fail
  })
}

const getTodoClass = function (condition, { success, fail }) {
  Util.xhr({
    url: todoClassUrl + condition,
    success,
    fail
  })
}

const getTodo = function (condition, { success, fail }) {
  Util.xhr({
    url: TodoUrl + condition,
    success,
    fail
  })
}

const updateTodo = function (condition, data = {}, { success, fail }) {
  Util.xhr({
    url: TodoUrl + condition,
    method: 'PUT',
    header: {
      'X-LC-Session': app.globalData.user['sessionToken']
    },
    data,
    success,
    fail
  })
}

const addTodo = function (data = {}, { success, fail }) {
  Util.xhr({
    url: TodoUrl + '?fetchWhenSave=true',
    method: 'POST',
    data: Object.assign({}, data, {
      'ACL': Util.setACL({user: [app.globalData.user.objectId]})
    }),
    success,
    fail
  })
}

const addTodoFollow = function (data = {}, { success, fail }) {
  Util.xhr({
    url: todoFollowUrl + '?fetchWhenSave=true',
    method: 'POST',
    data,
    success,
    fail
  })
}
const getTodoFollow = function(condition, { success, fail }) {
  Util.xhr({
    url: todoFollowUrl + condition,
    success,
    fail
  })
}



module.exports = {
  addTodoClass,
  getTodoClass,
  getTodo,
  addTodo,
  updateTodo,
  addTodoFollow,
  getTodoFollow
}


