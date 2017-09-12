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
function ArchiveState(todo) {
  const now = new Date().getTime()
  const start = new Date(todo.startAt.iso).getTime()
  const end = new Date(todo.endAt.iso).getTime()

  return todo.doneAt ? 'done' : end <= now ? 'expired' : start > now ? 'do' : 'doing'
}
function ArchiveToday(todo, {now, todayStart, todayEnd}) {
  const start = new Date(todo.startAt.iso).getTime()
  const end = new Date(todo.endAt.iso).getTime()

  return (start > todayStart && end < todayEnd) ? 'today' : null
}
function ArchiveWeek(todo, { now, weekStart, weekEnd }) {
  const start = new Date(todo.startAt.iso).getTime()
  const end = new Date(todo.endAt.iso).getTime()

  if (start >= weekEnd) {
    return 'next'
  } else {
    if ((start < weekEnd || end < weekEnd) && end > weekStart) return 'week'
    if (end < now) return 'expired'
  }
  return null
  // return end < now ? 'expired' : start >= weekEnd ? 'next' : ((start < weekEnd || end < weekEnd) && end > weekStart) ? 'week' : null
}


module.exports = {
  ArchiveClass,
  ArchiveState,
  ArchiveToday,
  ArchiveWeek
}
