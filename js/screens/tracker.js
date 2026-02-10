// js/screens/tracker.js

import { getState } from "../state.js";

/* ---------- CONSTANTS ---------- */

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

/* ---------- DATE HELPERS ---------- */

// Monday-first calendar matrix
function getMonthMatrix(year, month) {
  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];

  for (let i = 0; i < startOffset; i++) {
    cells.push(null);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(d);
  }

  return cells;
}

/* ---------- CALENDAR FACTORY ---------- */

function renderCalendar(type, year, month) {
  const cells = getMonthMatrix(year, month);

  return `
    <div class="calendar-card" data-calendar="${type}">
      <div class="calendar-header">
        <button class="cal-nav" data-cal="${type}" data-dir="-1">‹</button>
        <div class="cal-month">
          ${MONTHS[month]} ${year}
        </div>
        <button class="cal-nav" data-cal="${type}" data-dir="1">›</button>
      </div>

      <div class="calendar-grid">
        ${WEEK_DAYS.map(d => `<div class="cal-header">${d}</div>`).join("")}

        ${cells
          .map(day =>
            day
              ? `
                <div class="cal-cell">
                  <div class="cal-day">${day}</div>
                </div>
              `
              : `<div class="cal-cell empty"></div>`
          )
          .join("")}
      </div>
    </div>
  `;
}

/* ---------- MAIN RENDER ---------- */

export function renderTracker() {
  getState(); // reserved for future logic

  const today = new Date();

  return `
    <section class="tracker">
      <h1>Tracker</h1>

      <div class="tracker-section">
        <div class="tracker-title">HABIT TRACKER</div>
        ${renderCalendar("habits", today.getFullYear(), today.getMonth())}
      </div>

      <div class="tracker-section">
        <div class="tracker-title">HEALTH TRACKER</div>
        ${renderCalendar("health", today.getFullYear(), today.getMonth())}
      </div>
    </section>
  `;
}
