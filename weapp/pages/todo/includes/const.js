/**
 * Todo 归档:
 * 
 * 分类: classId
 * 状态分类: 未开始:do | 进行中:doine | 已完成:done | 已过期:expired
 * 时间分类: 今天:today | 本周:week | 以后:next
 */
const archive = [
  {
    type: 'today',
    title: '今天',
    icon: 'calendar',
    color: ''
  }, {
    type: 'expired',
    title: '已过期',
    icon: 'time',
    color: 'red'
  }, {
    type: 'doing',
    title: '进行中',
    icon: 'waiting',
    color: 'blue'
  }, {
    type: 'done',
    title: '已完成',
    icon: 'done',
    color: 'green'
  }
]

/**
 * todo Class 色值
 */
const color = {
  red: '#f44336',
  orange: '#ff9800',
  yellow: '#ffd422',
  green: '#04BE02',
  blue: '#2196f3',
  indigo: '#3f51b5',
  purple: '#9c27b0',
  pink: '#e91e63',
  cyan: '#00bcd4',
  teal: '#009688',
  brown: '#795548',
  black: '#212121'
}


module.exports = {
  ARCHIVE: archive,
  COLOR: color
}