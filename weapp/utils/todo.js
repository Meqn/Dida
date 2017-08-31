const app = getApp()
import { xhr, setACL } from './util'

const TodoUrl = '/classes/Todo'
const todoClassUrl = '/classes/TodoClass'

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
    url: todoClassUrl + '?' + condition,
    success,
    fail
  })
}

const getTodos = function (condition, { success, fail }) {
  xhr({
    url: TodoUrl + '?' + condition,
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



module.exports = {
  addTodoClass,
  getTodoClass,
  getTodos,
  addTodo
}


