const app = getApp()

/**
[{
  text: '',     // 菜单文本
  icon: '',     // 菜单图标
  fn: ''        // 菜单tap事件
}]
 */
const Menu = {
  // 初始化
  __menu_init(list) {
    this.setData({
      __menu: {
        hidden: true,
        style: '',
        list: list
      }
    })
  },
  // 显示操作菜单
  __menu_show(e) {
    const P = this.__menu_position(e)
    this.setData({
      '__menu.style': `${P.x.type}: ${P.x.val + 10}px; ${P.y.type}: ${P.y.val + 10}px;`,
      '__menu.hidden': false
    })
  },
  // 隐藏操作菜单
  __menu_hide(e) {
    this.setData({
      '__menu.hidden': true
    })
  },
  // 获取菜单位置信息
  __menu_position(e) {
    const { screenWidth, screenHeight } = app.globalData.systemInfo
    const winHeight = screenHeight - 64     // 微信额头：导航栏/状态栏 44 + 20
    const { clientX, clientY } = e.changedTouches[0]
  
    const dirX = screenWidth / 2 < clientX ? 'right' : 'left'
    const dirY = winHeight / 2 < clientY ? 'bottom' : 'top'
    const postionX = dirX === 'left' ? clientX : screenWidth - clientX
    const postionY = dirY === 'top' ? clientY : winHeight - clientY
    return {
      x: {
        type: dirX,
        val: postionX
      },
      y: {
        type: dirY,
        val: postionY
      }
    }
  }
}

export default Menu