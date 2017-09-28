const app = getApp()

export default function(e) {
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