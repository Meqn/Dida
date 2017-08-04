
function point(r) {
  let points = []
  for (let i = 0; i < 60; i++) {
    let rad = 2 * Math.PI / 60 * i
    let x = r * Math.cos(rad),
      y = r * Math.sin(rad),
      classname = i % 5 === 0 ? 'h' : 'm';
    points.push({ classname, x: r + x + 7, y: r + y + 7 })
  }
  return points;
}

function tick() {
  let now = new Date()
  let hour = now.getHours(),
    minute = now.getMinutes(),
    second = now.getSeconds();
  let secondRotate = second * 6,  // second * (360/60)
    minuteRotate = minute * 6,
    hourRotate = hour * 30 + minute / 2;  // hour * (360/12) + minute / 2 

  this.setData({
    clock: {
      hour,
      minute,
      second,
      hourRotate,
      minuteRotate,
      secondRotate
    }
  })
}

module.exports = {
  point,
  tick
}