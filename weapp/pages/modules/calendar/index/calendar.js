
/* 
function getMonthDays(date) {
  var dates = []
  for (var i = 0; i < 42; i++) {
    var startDate = moment(date).date(1)
    dates[i] = startDate.weekday(i).date()
  }
  return dates
}

function getDays(date) {
  var days = getMonthDays(date)
  var arr = []
  for (var i = 0; i < 6; i++) {
    arr[i] = days.slice(i * 7, i * 7 + 7)
  }
  return arr
}
 */

module.exports = {
  // getDays
}
