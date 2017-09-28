/**
 * 滑动函数
 * Swipe({x1, x2, y1, y2}, {
 *    swipeLeft(),
 *    swipeRight(),
 *    swipeUp(),
 *    swipeDown()
 * })
 */


function swipeDirection({ x1, x2, y1, y2 }) {
  return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down')
}

export default function({ x1, x2, y1, y2 }, cb = {}) {
  const diffX = Math.abs(x1 - x2)
  const diffY = Math.abs(y1 - y2)
  let evt = 'tap'
  let diff = 0
  let direction = null

  if (diffX > 30 || diffY > 30) {
    direction = swipeDirection({x1, x2, y1, y2})
    evt = 'swipe' + direction
    diff = (direction === 'Left' || direction === 'Right') ? diffX : diffY
  }
  typeof cb['swipe'] === 'function' && cb['swipe'](direction)
  typeof cb[evt] === 'function' && cb[evt](diff)
}
