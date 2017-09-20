const app = getApp()
import { Request, ACL } from '../utils/lean'
import RequestUrl from './url'

/**
 * 创建todo
 * @param {[obj]} data todo字段数据
 * @param {[obj]} object 数据回调方法
 */
function postTodo(data = {}, {success, fail}) {
  Request({
    url: RequestUrl.todo.todo + '?fetchWhenSave=true',
    method: 'POST',
    data: Object.assign({}, {
      ACL: ACL({user: [app.globalData.user.objectId]})
    }, data),
    success,
    fail
  })
}

/**
 * 获取todo
 * @param {[str]} condition 筛选条件
 * @param {[obj]} object 数据回调方法
 */
function getTodo(condition, { success, fail }) {
  Request({
    url: RequestUrl.todo.todo + condition,
    success,
    fail
  })
}

/**
 * 更新todo
 * @param {[str]} condition 筛选条件
 * @param {[obj]} data 更新数据
 * @param {[obj]} object 数据回调方法
 */
function updatTodo(condition, data = {}, {success, fail}) {
  Request({
    url: RequestUrl.todo.todo + condition,
    method: 'PUT',
    header: {
      'X-LC-Session': app.globalData.user['sessionToken']
    },
    data,
    success,
    fail
  })
}

/**
 * 删除todo
 * @param {[str]} condition 筛选条件
 * @param {[obj]} object 数据回调方法
 */
function deleteTodo(condition, {success, fail}) {
  Request({
    url: RequestUrl.todo.todo + condition,
    method: 'DELETE',
    header: {
      'X-LC-Session': app.globalData.user['sessionToken']
    },
    success,
    fail
  })
}

/**
 * 创建 todo class
 * @param {[obj]} data 字段数据
 * @param {[obj]} object 数据回调方法
 */
function postClass(data = {}, { success, fail }) {
  Request({
    url: RequestUrl.todo.class + '?fetchWhenSave=true',
    method: 'POST',
    data: Object.assign({}, {
      ACL: ACL({user: [app.globalData.user.objectId]})
    }, data),
    success,
    fail
  })
}

/**
 * 获取todo class数据
 * @param {[str]} condition 筛选条件
 * @param {[obj]} object 数据回调方法
 */
function getClass(condition, { success, fail }) {
  Request({
    url: RequestUrl.todo.class + condition,
    success,
    fail
  })
}

function updateClass() {
}

function deleteClass(params) {
}

/**
 * 创建follow todo数据
 * @param {[obj]} data 字段数据
 * @param {[obj]} object 数据回调方法
 */
function postFollow(data = {}, {success, fail}) {
  Request({
    url: RequestUrl.todo.follow + '?fetchWhenSave=true',
    method: 'POST',
    data: Object.assign({}, {
      ACL: ACL({user: [app.globalData.user.objectId]})
    }, data),
    success,
    fail
  })
}

/**
 * 获取follow todo数据
 * @param {[str]} condition 筛选条件
 * @param {[obj]} object 数据回调方法
 */
function getFollow(condition, {success, fail}) {
  Request({
    url: RequestUrl.todo.follow + condition,
    success,
    fail
  })
}

function deleteFollow(params) {
  //
}



module.exports = {
  postTodo, getTodo, updatTodo,
  postClass, getClass,
  postFollow, getFollow
}