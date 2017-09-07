module.exports = {
  mode: [
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
      type: 'do',
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
}