



// 画外框
function drawBackground(ctx, r) {
  ctx.save()
  // 开始路径
  ctx.beginPath();
  // 设置线条的粗细，单位px
  ctx.setLineWidth(10);
  // 运动一个圆的路径
  // arc(x,y,半径,起始位置，结束位置，false为顺时针运动)
  var grd = ctx.createLinearGradient(-60, -120, 0, 0);
  grd.addColorStop(0, "rgb(100,100,100)");
  grd.addColorStop(1, "rgb(30,30,30)");
  ctx.setStrokeStyle(grd);
  ctx.arc(0, 0, r - 15, 0, 2 * Math.PI, false);
  ctx.setShadow(3, 5, 16, 'rgba(0, 0, 0, .3)')

  ctx.stroke();
  ctx.closePath();
  // 描出点的路径
  ctx.restore()


  //外圆投影
  /* ctx.beginPath();
  ctx.setLineWidth(16);
  var grd = ctx.createCircularGradient(0, 0, r);
  grd.addColorStop(0, "rgb(255,0,0)");
  grd.addColorStop(1, "rgb(150, 150, 150)");
  ctx.setFillStyle(grd);
  ctx.arc(0, 0, r - 20, 0, 2 * Math.PI, false);
  ctx.closePath();
  ctx.stroke(); */
}

//画时刻
function drawdots(ctx, r) {
  for (var i = 0; i < 60; i++) {
    var rad = 2 * Math.PI / 60 * i;
    var x = Math.cos(rad) * (r - 26);
    var y = Math.sin(rad) * (r - 26);
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2, false);
    if (i % 5 == 0) {
      ctx.setFillStyle("rgb(221, 221, 221)");
      ctx.fill();
    }
  }
  ctx.closePath();
}


//画时针
function drawHour(ctx, r, hour, minute, second) {
  // 保存画之前的状态
  ctx.save();
  ctx.beginPath();
  // 根据小时数确定大的偏移
  var rad = 2 * Math.PI / 12 * hour;
  // 根据分钟数确定小的偏移
  // var mrad = 2 * Math.PI / 12 / 60 * minute;
  var mrad = ((2 * Math.PI / 12) * (minute + second / 60) / 60); //将分，秒换算成小时
  // 做旋转
  ctx.rotate(rad + mrad);
  ctx.setFillStyle("rgb(0, 0, 0)");
  ctx.setLineWidth(8);
  // 设置线条结束样式为圆
  ctx.setLineCap('round');
  // 时针向后延伸8个px；
  ctx.moveTo(0, 10);
  // 一开始的位置指向12点的方向，长度为r/2
  ctx.lineTo(0, -r / 2);
  ctx.stroke();
  ctx.closePath();
  // 返回画之前的状态
  ctx.restore();
}


// 画分针
function drawMinute(ctx, r, hour, minute, second) {
  ctx.save();
  ctx.beginPath();
  // 根据分钟数确定大的偏移
  var rad = 2 * Math.PI / 60 * minute;
  // 根据秒数确定小的偏移
  var mrad = (2 * Math.PI / 60) * (second / 60); //将秒换算成分
  ctx.rotate(rad + mrad);
  // 分针比时针细
  ctx.setLineWidth(5);
  ctx.setFillStyle("rgb(0, 0, 0)");
  ctx.setLineCap('round');
  ctx.moveTo(0, 15);
  // 一开始的位置指向12点的方向，长度为3 * r / 4
  ctx.lineTo(0, -3 * r / 4);
  // ctx.lineTo(0, -(r - 40));
  ctx.stroke();
  ctx.closePath();
  ctx.restore();
}

// 画秒针
function drawSecond(ctx, r, hour, minute, second) {
  ctx.save();
  ctx.beginPath();
  // 根据秒数确定大的偏移
  var rad = 2 * Math.PI / 60 * second;
  // 1000ms=1s所以这里多除个1000
  // var mrad = 2 * Math.PI / 60 / 1000 * msecond;
  // ctx.rotate(rad + mrad);
  ctx.rotate(rad);
  ctx.setLineWidth(2);
  // 设置线条颜色为红色，默认为黑色
  ctx.setStrokeStyle('rgb(200, 0, 0)');
  ctx.setLineCap('round');
  ctx.moveTo(0, 20);
  ctx.lineTo(0, -(r - 25));
  ctx.stroke();
  ctx.closePath();
  ctx.restore();
}


//画中间的小圆心
function drawDot(ctx) {
  ctx.beginPath();
  ctx.arc(0, 0, 4, 0, 2 * Math.PI, false);
  ctx.setFillStyle("rgb(255, 255, 255)");
  ctx.fill();
  ctx.closePath();
  ctx.restore();
}







function draw(ctx, {width = 360, height = 360, hour = 0, minute = 0, second = 0}) {
  // console.log('this.width .... ', this.motto)
  const r = width / 2;
  ctx.translate(width/2, height/2);
  drawBackground(ctx, r)
  drawdots(ctx, r)
  drawHour(ctx, r, hour, minute, second)
  drawMinute(ctx, r, hour, minute, second)
  drawSecond(ctx, r, hour, minute, second)
  drawDot(ctx, r)
  // 微信小程序要多个draw才会画出来，所以在最后画出
  ctx.draw();
}


function init(ctx, options) {
  let now = new Date();
  const opts = Object.assign({}, {
    width: 360,
    height: 360,
    hour: now.getHours(),
    minute: now.getMinutes(),
    second: now.getSeconds()
  }, options)
  draw(ctx, opts)
}

module.exports = {
  clockDraw: draw,
  clockInit: init
}
