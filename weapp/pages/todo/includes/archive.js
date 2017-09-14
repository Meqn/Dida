/*
 * Todo 归档
 * 
 * 归档页面: classList, modeList, invite
 * 
 * 分类: classId
 * 状态分类: 未开始:do | 进行中:doine | 已完成:done | 已过期:expired
 * 时间分类: 今天:today | 本周:week | 以后:next
 */

function ArchiveClass(todo) {
  return todo.classId
}
// 状态分类
function ArchiveState(todo, nowTime) {
  const now = nowTime ? nowTime : new Date().getTime()
  const start = new Date(todo.startAt.iso).getTime()
  const end = new Date(todo.endAt.iso).getTime()

  return todo.doneAt ? 'done' : end <= now ? 'expired' : start > now ? 'do' : 'doing'
}
// 日期分类
function ArchiveDate(todo, {dayStart, dayEnd}) {
  const start = new Date(todo.startAt.iso).getTime()
  const end = new Date(todo.endAt.iso).getTime()

  return (!todo.doneAt && start < dayEnd && end > dayStart) ? 'date' : null
}
// 周分类
function ArchiveWeek(todo, { weekStart, weekEnd }) {
  const start = new Date(todo.startAt.iso).getTime()
  const end = new Date(todo.endAt.iso).getTime()

  return start >= weekEnd ? 'next' : ((start < weekEnd || end < weekEnd) && end > weekStart) ? 'week' : null
  // return end < now ? 'expired' : start >= weekEnd ? 'next' : ((start < weekEnd || end < weekEnd) && end > weekStart) ? 'week' : null
}


module.exports = {
  ArchiveClass,
  ArchiveState,
  ArchiveDate,
  ArchiveWeek
}
