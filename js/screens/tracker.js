// js/screens/tracker.js

import { getState } from "../state.js";
import { getAppDayKey } from "../day.js";

/* ---------- CONSTANTS ---------- */

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = [
  "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
  "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
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

function dateToKey(year, month, day) {
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

/* ---------- HABIT EVALUATION ---------- */

function evaluateHabitDay(state, dayKey, todayKey) {
  // Not evaluable yet
  if (dayKey >= todayKey) return "neutral";

  const habits = state.habits || [];
  if (habits.length === 0) return "neutral";

  const day = state.history[dayKey];
  if (!day || !day.habits) return "failure";

  for (const habit of habits) {
    if (!day.habits[habit.id]) {
      return "failure";
    }
  }

  return "success";
}

/* ---------- CALENDAR ---------- */

function renderHabitCalendar(year, month) {
  const state = getState();
  const todayKey = getAppDayKey();
  const cells = getMonthMatrix(year, month);

  return `
    <div class="calendar-card" data-calendar="habits">
      <div class="calendar-header">
        <button class="cal-nav" data-cal="habits" data-dir="-1">‹</button>
        <div class="cal-month">
          ${MONTHS[month]} ${year}
        </div>
        <button class="cal-nav" data-cal="habits" data-dir="1">›</button>
      </div>

      <div class="calendar-grid">
        ${WEEK_DAYS.map(d => `<div class="cal-header">${d}</div>`).join("")}

        ${cells
          .map(day => {
            if (!day) {
              return `<div class="cal-cell empty"></div>`;
            }

            const dayKey = dateToKey(year, month, day);
            const status = evaluateHabitDay(state, dayKey, todayKey);

            return `
              <div class="cal-cell ${status}">
                <div class="cal-day">${day}</div>
              </div>
            `;
          })
          .join("")}
      </div>
    </div>
  `;
}

/* ---------- MAIN RENDER ---------- */

export function renderTracker() {
  const today = new Date();

  return `
    <section class="tracker">
      <h1>Tracker</h1>

      <div class="tracker-section">
        <div class="tracker-title">HABIT TRACKER</div>
        ${renderHabitCalendar(today.getFullYear(), today.getMonth())}
      </div>

      <div class="tracker-section">
        <div class="tracker-title">HEALTH TRACKER</div>
        <!-- Health logic added in next phase -->
        ${renderHabitCalendar(today.getFullYear(), today.getMonth())}
      </div>
    </section>
  `;
}
