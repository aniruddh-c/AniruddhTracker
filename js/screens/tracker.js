// js/screens/tracker.js

import { getState } from "../state.js";

/* ---------- DATE HELPERS ---------- */

// Monday-first week
const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getMonthMatrix(year, month) {
  const firstDay = new Date(year, month, 1);
  const startDay = (firstDay.getDay() + 6) % 7; // Monday = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];

  // Empty cells before month starts
  for (let i = 0; i < startDay; i++) {
    cells.push(null);
  }

  // Days of month
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(d);
  }

  return cells;
}

/* ---------- CALENDAR RENDER ---------- */

function renderCalendar(title) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const cells = getMonthMatrix(year, month);

  const dayHeaders = WEEK_DAYS.map(
    d => `<div class="cal-header">${d}</div>`
  );

  const dayCells = cells.map(day => {
    if (!day) {
      return `<div class="cal-cell empty"></div>`;
    }

    return `
      <div class="cal-cell">
        <div class="cal-day">${day}</div>
        <div class="cal-mark">–</div>
      </div>
    `;
  });

  return `
    <div class="calendar-card">
      <h2>${title}</h2>

      <div class="calendar-grid">
        ${dayHeaders.join("")}
        ${dayCells.join("")}
      </div>
    </div>
  `;
}

/* ---------- MAIN RENDER ---------- */

export function renderTracker() {
  getState(); // reserved for later logic

  return `
    <section class="tracker">
      <h1>Tracker</h1>

      ${renderCalendar("Habit Tracker")}
      ${renderCalendar("Health Tracker")}
    </section>
  `;
}
