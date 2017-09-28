const app = getApp()
import Util from '../../../utils/util'
import Qdate from '../../../libs/scripts/date'
import Todo from '../includes/todo'
import { ArchiveState } from '../includes/archive'

// 优先级状态
function priorityStatus(num) {
  return {
    important: (num === 1 || num === 3) ? true : false,
    urgent: (num === 2 || num === 3) ? true : false,
    priority: num
  }
}
// 获取优先级的值
function getPriority(important, urgent) {
  return (important ? 1 : 0) + (urgent ? 2 : 0)
}
// 获取某天开始的30天日历
function getDate(date) {
  let text = Qdate.getDateAfterDays(30, date, 'yyyy-MM-dd 周wCN')
  let val = Qdate.getDateAfterDays(30, date, 'yyyy/MM/dd')
  if (!date) {
    text[0] = text[0] + ' [今天]'
    text[1] = text[1] + ' [明天]'
    text[2] = text[2] + ' [后天]'
  }
  return {text, val}
}

/**
 * 设置开始时间和完成时间
 * @param {[str | date]} start 开始的日期
 * @param {[str | date]} current 当天日期
 * @param {[str]} type 开始时间｜结束时间
 */
function setDate(start, current, type = 'start') {
  const dt = Qdate.toDate(current)
  const d = dt.format('yyyy/MM/dd')
  let index = getDate(start).val.indexOf(d)
  if (start) {
    index = index === -1 ? 0 : index
  } else {
    index = type === 'start' ? 1 : 2
  }

  return {
    time: dt.format('hh:mm'),
    index
  }
}

// 设置默认class
function getClass(cb) {
  if (!app.globalData.temp.todoClass) {
    Todo.getClass().then(res => {
      const _class = {
        name: res[0].title,
        id: res[0].objectId
      }
      app.globalData.temp.todoClass = _class
      typeof cb === 'function' && cb(_class)
    })
  } else {
    typeof cb === 'function' && cb(app.globalData.temp.todoClass)
  }
}

// 设置默认数据
function setDefaultData(todoId, cb) {
  let ret = {}

  if (todoId) {
    Todo.getTodoDetail(todoId).then(res => {
      const _status = ArchiveState(res)
      if (_status === 'done' || _status === 'expired') {
        return Util.toast('无法修改', 'error', {
          duration: 2000,
          complete() {
            setTimeout(() => {
              wx.redirectTo({url: `/pages/todo/detail/detail?todoId=${res.objectId}&classId=${res.classId}`})
            }, 2000)
          }
        })
      }
      const { title, content, priority, remind, startAt, endAt, classId } = res
      const { urgent, important } = priorityStatus(res.priority)
      const dateTime = {
        start: setDate(startAt.iso, startAt.iso, 'start'),
        end: setDate(startAt.iso, endAt.iso, 'end'),
        date: getDate(startAt.iso)
      }
      const _class = { id: classId, name: app.globalData.todoClass[classId].title }
      ret = {
        action: 'put',
        status: 0,
        error: '',
        todoId,
        title,
        content,
        urgent,
        important,
        remind,
        dateTime,
        class: _class
      }
      app.globalData.temp.todoClass = _class
      typeof cb === 'function' && cb(ret)
    })
  } else {
    getClass(res => {
      ret = {
        action: 'post',
        dateTime: {
          date: getDate(),
          start: setDate(null, null, 'start'),
          end: setDate(null, null, 'end')
        },
        class: res
      }
      typeof cb === 'function' && cb(ret)
    })
  }
}


module.exports = {
  priorityStatus,
  getPriority,
  getDate,
  setDate,
  setDefaultData
}