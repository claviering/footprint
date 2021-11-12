<script setup lang="ts">
import { onMounted } from "vue";
import {
  formateDate,
  getOneYearbeforeDay,
  nextDay,
  getDayOfWeek,
} from "./utils";
const MONTH = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAY = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const namespaceURI = "http://www.w3.org/2000/svg";
onMounted(() => {
  let content = document.querySelector("#footprint g");
  let monthList = initRect(content);
  initMonth(content, monthList);
  initDay(content);
  initSummay();
});
const initDay = (content: any) => {
  let startWeek = getDayOfWeek(getOneYearbeforeDay()) + 1;
  for (let i = 1; i <= 3; i++) {
    const day = DAY[(startWeek + (i - 1) * 2) % 7];
    let textDom: any = document.createElementNS(namespaceURI, "text");
    textDom.setAttributeNS(null, "dx", "-10");
    // 在线多项式曲线及曲线函数拟合工具
    // http://tools.jb51.net/jisuanqi/create_fun
    // -0.5*x*x+32.5*x-7
    textDom.setAttributeNS(null, "dy", String(-0.5 * i * i + 32.5 * i - 7));
    textDom.setAttributeNS(null, "class", "ContributionCalendar-label");
    textDom.textContent = day.substring(0, 3);
    content.appendChild(textDom);
  }
};
const initMonth = (content: any, monthList: number[]) => {
  let startMonthIndex = new Date(getOneYearbeforeDay()).getMonth();
  for (let i = 0; i < MONTH.length; i++) {
    const month = MONTH[(startMonthIndex + i) % 12];
    let textDom: any = document.createElementNS(namespaceURI, "text");
    textDom.setAttributeNS(null, "x", String(15 * (monthList[i] + 1)));
    textDom.setAttributeNS(null, "y", "-8");
    textDom.setAttributeNS(null, "class", "ContributionCalendar-label");
    textDom.textContent = month.substring(0, 3);
    content.appendChild(textDom);
  }
};
const initRect = (content: any) => {
  let oneYearBeforeDay = getOneYearbeforeDay();
  let preMonth = new Date(oneYearBeforeDay).getMonth();
  let monthList: number[] = [0]; // 记录每个月的第一天的列数 + 1
  for (let i = 0; i < 53; i++) {
    let monthIndex = new Date(oneYearBeforeDay).getMonth();
    if (preMonth !== monthIndex) {
      monthList.push(i);
      preMonth = monthIndex;
    }
    let gDom: any = document.createElementNS(namespaceURI, "g");
    gDom.setAttributeNS(null, "transform", `translate(${i * 15},0)`);
    for (let j = 0; j < 7; j++) {
      if (oneYearBeforeDay > new Date().getTime()) {
        break;
      }
      let dataLevel = getDataLevel();
      let date = formateDate(oneYearBeforeDay);
      let rectDom: any = document.createElementNS(namespaceURI, "rect");
      let attr: any = {
        width: "11",
        height: "11",
        x: "15",
        y: `${j * 15}`,
        class: "ContributionCalendar-day",
        rx: "2",
        ry: "2",
        "data-count": "0",
        "data-level": `${dataLevel}`,
        "data-date": `${date}`,
      };
      for (let key in attr) {
        rectDom.setAttributeNS(null, key, attr[key]);
      }
      gDom.appendChild(rectDom);
      oneYearBeforeDay = nextDay(oneYearBeforeDay);
    }
    content.appendChild(gDom);
  }
  return monthList;
};
const getDataLevel = () => {
  let r = Math.random();
  if (r > 0.8) {
    return 4;
  } else if (r > 0.6) {
    return 3;
  } else if (r > 0.4) {
    return 2;
  } else if (r > 0.2) {
    return 1;
  } else {
    return 0;
  }
};
const initSummay = () => {
  let summaryDom: any = document.querySelector(".summary");
  summaryDom.innerHTML = "Less&nbsp;";
  for (let i = 0; i <= 4; i++) {
    let html = `<svg width="10" height="10" class="d-inline-block">
                <rect width="10" height="10" class="ContributionCalendar-day" rx="2" ry="2" data-level="${i}"></rect>
              </svg>&nbsp;`;
    summaryDom.innerHTML += html;
  }
  summaryDom.innerHTML += "More";
};
</script>

<template>
  <div class="content">
    <svg id="footprint" width="828" height="128">
      <g transform="translate(10, 20)"></g>
    </svg>
    <div class="summary"></div>
  </div>
</template>

<style>
:root {
  --color-border-default: #d0d7de;
  --color-fg-default: #24292f;
  --color-calendar-graph-day-bg: #ebedf0;
  --color-calendar-graph-day-border: rgba(27, 31, 35, 0.06);
  --color-fg-mute: #57606a;
  --color-calendar-graph-day-L1-bg: #9be9a8;
  --color-calendar-graph-day-L1-border: rgba(27, 31, 35, 0.06);
  --color-calendar-graph-day-L2-bg: #40c463;
  --color-calendar-graph-day-L2-border: rgba(27, 31, 35, 0.06);
  --color-calendar-graph-day-L3-bg: #30a14e;
  --color-calendar-graph-day-L3-border: rgba(27, 31, 35, 0.06);
  --color-calendar-graph-day-L4-bg: #216e39;
  --color-calendar-graph-day-L4-border: rgba(27, 31, 35, 0.06);
}
html,
body {
  padding: 0px;
  margin: 0px;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial,
    sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
}
#app {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.content {
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  padding: 8px 0px;
  border: 1px solid var(--color-border-default);
  text-align: center;
  width: 894px;
}
.vertical {
  transform: translate(32px, 806px) rotate(270deg);
}
.ContributionCalendar-label {
  font-size: 9px;
  fill: var(--color-fg-default);
}
.ContributionCalendar-day {
  fill: var(--color-calendar-graph-day-bg);
  shape-rendering: geometricPrecision;
  outline: 1px solid var(--color-calendar-graph-day-border);
  outline-offset: -1px;
  box-sizing: border-box;
}
.ContributionCalendar-day[data-level="0"] {
  fill: var(--color-calendar-graph-day-bg);
  outline: 1px solid var(--color-calendar-graph-day-borde);
}
.ContributionCalendar-day[data-level="1"] {
  fill: var(--color-calendar-graph-day-L1-bg);
  outline: 1px solid var(--color-calendar-graph-day-L1-border);
}
.ContributionCalendar-day[data-level="2"] {
  fill: var(--color-calendar-graph-day-L2-bg);
  outline: 1px solid var(--color-calendar-graph-day-L2-border);
}
.ContributionCalendar-day[data-level="3"] {
  fill: var(--color-calendar-graph-day-L3-bg);
  outline: 1px solid var(--color-calendar-graph-day-L3-border);
}
.ContributionCalendar-day[data-level="4"] {
  fill: var(--color-calendar-graph-day-L4-bg);
  outline: 1px solid var(--color-calendar-graph-day-L4-border);
}
.summary {
  font-size: 12px;
  color: var(--color-fg-muted);
  width: 803px;
  text-align: right;
  margin: auto;
}
</style>
