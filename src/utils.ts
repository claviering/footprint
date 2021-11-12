// format time to yyyy-MM-dd
function formateDate(time: number) {
  let date = new Date(time);
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  return `${year}-${month}-${day}`;
}

function getOneYearbeforeDay() {
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth();
  let day = date.getDate();
  let oneYearbeforeDay = new Date(year - 1, month, day);
  return oneYearbeforeDay.getTime();
}

function nextDay(time: number) {
  let date = new Date(time);
  let year = date.getFullYear();
  let month = date.getMonth();
  let day = date.getDate();
  let nextDay = new Date(year, month, day + 1);
  return nextDay.getTime();
}

// get Day of the week
function getDayOfWeek(time: number) {
  let date = new Date(time);
  let day = date.getDay();
  return day;
}

export { formateDate, getOneYearbeforeDay, nextDay, getDayOfWeek };
