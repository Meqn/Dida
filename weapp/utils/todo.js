const app = getApp()
import { xhr, setACL } from './util'

const TodoUrl = '/classes/Todo'
const todoClassUrl = '/classes/TodoClass'
const todoFollowUrl = '/classes/TodoFollow'

const addTodoClass = function (data = {}, { success, fail }) {
  xhr({
    url: todoClassUrl + '?fetchWhenSave=true',
    method: 'POST',
    data,
    success,
    fail
  })
}

const getTodoClass = function (condition, { success, fail }) {
  xhr({
    url: todoClassUrl + condition,
    success,
    fail
  })
}

const getTodo = function (condition, { success, fail }) {
  xhr({
    url: TodoUrl + condition,
    success,
    fail
  })
}

const addTodo = function (data = {}, { success, fail }) {
  xhr({
    url: TodoUrl + '?fetchWhenSave=true',
    method: 'POST',
    data,
    success,
    fail
  })
}

const addTodoFollow = function (data = {}, { success, fail }) {
  xhr({
    url: todoFollowUrl + '?fetchWhenSave=true',
    method: 'POST',
    data,
    success,
    fail
  })
}
const getTodoFollow = function(condition, { success, fail }) {
  xhr({
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
  addTodoFollow,
  getTodoFollow
}


