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
    // 最小二乘法
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
        "data-count": `${dataLevel}`,
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
const currentTooltip = document.createElement('div')
currentTooltip.classList.add('svg-tip', 'svg-tip-one-line')
// Remove pointer events to prevent tooltip flickering
currentTooltip.style.pointerEvents = 'none'
// currentTooltip.hidden = true
// Add the tooltip to
document.body.appendChild(currentTooltip)

function hideTooltip() {
  if (currentTooltip) {
    currentTooltip.hidden = true
  }
}
function showTooltip(el: Element) {
  hideTooltip()

  const date = utcDate(el.getAttribute('data-date')!)
  const count = parseInt(el.getAttribute('data-count') || '')

  const formatted = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(date)
  const label = count === 0 ? 'No' : new Intl.NumberFormat('en-US').format(count)

  const strong = document.createElement('strong')
  strong.textContent = `${label} ${count === 1 ? 'contribution' : 'contributions'}`

  currentTooltip.innerHTML = ''
  currentTooltip.append(strong, ` on ${formatted}`)

  // We have to show the tooltip before calculating it's position.
  currentTooltip.hidden = false

  const bounds = el.getBoundingClientRect()
  const x = bounds.left + window.pageXOffset - currentTooltip.offsetWidth / 2 + bounds.width / 2
  const y = bounds.bottom + window.pageYOffset - currentTooltip.offsetHeight - bounds.height * 2
  const graphContainer = document.querySelector('.content')
  const graphContainerBounds = graphContainer!.getBoundingClientRect()
  currentTooltip.style.top = `${y}px`

  if (isTooFarLeft(graphContainerBounds, x)) {
    currentTooltip.style.left = `${southwestTooltip(bounds)}px`
    currentTooltip.classList.add('left')
    currentTooltip.classList.remove('right')
  } else if (isTooFarRight(graphContainerBounds, x)) {
    currentTooltip.style.left = `${southeastTooltip(bounds)}px`
    currentTooltip.classList.add('right')
    currentTooltip.classList.remove('left')
  } else {
    currentTooltip.style.left = `${x}px`
    currentTooltip.classList.remove('left')
    currentTooltip.classList.remove('right')
  }
}
function isTooFarLeft(graphContainerBounds: DOMRect, tooltipX: number) {
  return graphContainerBounds.x > tooltipX
}

function isTooFarRight(graphContainerBounds: DOMRect, tooltipX: number) {
  return graphContainerBounds.x + graphContainerBounds.width < tooltipX + currentTooltip.offsetWidth
}

function southwestTooltip(bounds: DOMRect) {
  return bounds.left + window.pageXOffset - currentTooltip.offsetWidth * 0.1 + bounds.width / 2
}

function southeastTooltip(bounds: DOMRect) {
  return bounds.left + window.pageXOffset - currentTooltip.offsetWidth * 0.9 + bounds.width / 2
}
// Parse date in ISO 8601 format: 2015-10-20. Avoids cross-browser time zone
// problems interpreting the intent, local vs utc, of `new Date('2015-10-20')`.
function utcDate(iso: string): Date {
  const [year, month, date] = iso.split('-').map(x => parseInt(x, 10))
  return new Date(Date.UTC(year, month - 1, date))
}
const mouseover = (event: Event) => {
  const target = event.target as Element;
  if (target.matches('rect[data-count]')) {
      showTooltip(target)
    }
}
</script>

<template>
  <div class="content" @mouseover="mouseover" @mouseout="hideTooltip">
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
  --color-neutral-emphasis-plus: #24292f;
  --color-fg-on-emphasis: #ffffff;
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
.svg-tip {
    position: absolute;
    z-index: 99999;
    padding: 8px 16px;
    font-size: 12px;
    color: var(--color-fg-on-emphasis);
    text-align: center;
    background: var(--color-neutral-emphasis-plus);
    border-radius: 6px
}
.svg-tip.left::after {
    left: 10%
}

.svg-tip.right::after {
    left: 90%
}
.svg-tip::after {
    position: absolute;
    bottom: -10px;
    left: 50%;
    width: 5px;
    height: 5px;
    box-sizing: border-box;
    margin: 0 0 0 -5px;
    content: " ";
    border: 5px solid transparent;
    border-top-color: var(--color-neutral-emphasis-plus)
}
.svg-tip-one-line {
    white-space: nowrap
}
</style>
