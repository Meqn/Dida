/**
 * Todo 归档:
 * 
 * 分类: classId
 * 状态分类: 未开始:do | 进行中:doine | 已完成:done | 已过期:expired
 * 时间分类: 今天:today | 本周:week | 以后:next
 */
const all = {
  class: function() {
    return []
  },
  state: [
    {
      type: 'doing',
      title: '进行中',
      icon: 'waiting',
      color: 'blue'
    }, {
      type: 'expired',
      title: '已过期',
      icon: 'time',
      color: 'red'
    }, {
      type: 'do',
      title: '未开始',
      icon: 'order',
      color: 'purple'
    }, {
      type: 'done',
      title: '已完成',
      icon: 'done',
      color: 'green'
    }
  ],
  date: [
    {
      type: 'today',
      title: '今天',
      icon: 'calendar',
      color: ''
    },{
      type: 'week',
      title: '本周',
      icon: '',
      color: ''
    },{
      type: 'next',
      title: '接下来',
      icon: '',
      color: ''
    }
  ]
}

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

const archive = [all.date[0], ...all.state]

const todoState = function() {
  const ret = {}
  all.state.reduce((acc, v) => {
    ret[v.type] = []
  }, 0)
  return ret
}

module.exports = {
  ALL: all,
  ARCHIVE: archive,
  COLOR: color,
  todoState: todoState
}