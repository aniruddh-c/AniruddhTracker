// js/screens/tracker.js

import { getState } from "../state.js";
import { getAppDayKey } from "../day.js";
import { openDayModal } from "../ui/dayModal.js";
import { renderHeader } from "../ui/header.js";

/* ---------- CONSTANTS ---------- */

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = [
  "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
  "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
];

let habitMonth = null;
let healthMonth = null;

/*
  Default food calories (same as Home)
*/
const DEFAULT_FOOD_CALORIES = {
  breakfast: { Eggs: 80, Bread: 70, Milk: 120, Cornflakes: 110 },
  lunch: { Roti: 100, Dal: 150, Chicken: 250 },
  snacks: { Biscuits: 100, Fruit: 80 },
  dinner: { Roti: 100, Dal: 150, Chicken: 250 }
};

/* ---------- DATE HELPERS ---------- */

function getMonthMatrix(year, month) {
  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

function dateToKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/* ---------- CALORIE CALC ---------- */

function computeCaloriesEaten(state, day) {
  if (!day || !day.calories) return 0;
  let total = 0;

  for (const meal in day.calories) {
    const mealCounts = day.calories[meal] || {};

    // default foods
    const defaults = DEFAULT_FOOD_CALORIES[meal] || {};
    for (const food in defaults) {
      total += (mealCounts[food] ?? 0) * defaults[food];
    }

    // custom foods
    const customFoods = state.customFoods?.[meal] || [];
    for (const food of customFoods) {
      total += (mealCounts[food.name] ?? 0) * food.calories;
    }
  }

  return total;
}

/* ---------- EVALUATORS ---------- */

function evaluateHabitDay(state, dayKey, todayKey) {
  if (dayKey >= todayKey) return "neutral";

  const habits = state.habits || [];
  if (habits.length === 0) return "neutral";

  const day = state.history[dayKey];
  if (!day || !day.habits) return "failure";

  for (const habit of habits) {
    if (!day.habits[habit.id]) return "failure";
  }

  return "success";
}

function evaluateHealthDay(state, dayKey, todayKey) {
  if (dayKey >= todayKey) return "neutral";

  const day = state.history[dayKey];
  if (!day) return "failure";

  const caloriesEaten = computeCaloriesEaten(state, day);
    const calorieTarget = day.targets?.calorie ?? state.settings.calorieTarget;
    const stepTarget = day.targets?.steps ?? state.settings.stepTarget;

    const stepsOk = (day.steps ?? 0) >= stepTarget;
    const caloriesOk = caloriesEaten <= calorieTarget;


  return stepsOk && caloriesOk ? "success" : "failure";
}

/* ---------- CALENDAR RENDER ---------- */

function renderCalendar(type, year, month) {
  const state = getState();
  const todayKey = getAppDayKey();
  const cells = getMonthMatrix(year, month);

  return `
    <div class="calendar-card" data-type="${type}">
      <div class="calendar-header">
        <button class="cal-nav" data-cal="${type}" data-dir="-1">‹</button>
        <div class="cal-month">${MONTHS[month]} ${year}</div>
        <button class="cal-nav" data-cal="${type}" data-dir="1">›</button>
      </div>

      <div class="calendar-grid">
        ${WEEK_DAYS.map(d => `<div class="cal-header">${d}</div>`).join("")}

        ${cells.map(day => {
          if (!day) return `<div class="cal-cell empty"></div>`;

          const dayKey = dateToKey(year, month, day);
          const status =
            type === "habits"
              ? evaluateHabitDay(state, dayKey, todayKey)
              : evaluateHealthDay(state, dayKey, todayKey);

          return `
            <div class="cal-cell ${status}">
              <div class="cal-day">${day}</div>
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;
}

/* ---------- MAIN ---------- */

export function renderTracker() {
//   const today = new Date();
  const now = new Date();

    habitMonth ??= { year: now.getFullYear(), month: now.getMonth() };
    healthMonth ??= { year: now.getFullYear(), month: now.getMonth() };
  return `
    <section class="tracker">
      ${renderHeader("Tracker")}

      <div class="tracker-section">
        <div class="tracker-title">HABIT TRACKER</div>
        ${renderCalendar("habits", habitMonth.year, habitMonth.month)}
      </div>

      <div class="tracker-section">
        <div class="tracker-title">HEALTH TRACKER</div>
        ${renderCalendar("health", healthMonth.year, healthMonth.month)}
      </div>
    </section>
  `;
}

document.addEventListener("click", e => {
  const btn = e.target.closest(".cal-nav");
  if (!btn) return;

  const dir = Number(btn.dataset.dir);
  const type = btn.dataset.cal;

  const target = type === "habits" ? habitMonth : healthMonth;

  target.month += dir;

  if (target.month < 0) {
    target.month = 11;
    target.year--;
  } else if (target.month > 11) {
    target.month = 0;
    target.year++;
  }

  document.getElementById("screen").innerHTML = renderTracker();
});

let longPressTimer = null;

document.addEventListener("pointerdown", e => {
  const cell = e.target.closest(".cal-cell");
  if (!cell || cell.classList.contains("empty")) return;

  const dayEl = cell.querySelector(".cal-day");
  if (!dayEl) return;

  const calendar = cell.closest(".calendar-card");
  if (!calendar) return;

  const day = Number(dayEl.textContent);

  const monthLabel = calendar.querySelector(".cal-month").textContent;
  const [monthName, year] = monthLabel.split(" ");
  const month = MONTHS.indexOf(monthName);

  const dayKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const todayKey = getAppDayKey();

  if (dayKey >= todayKey) return;

  const type = calendar.dataset.type; // "habits" or "health"

  longPressTimer = setTimeout(() => {
    openDayModal(dayKey, type);
  }, 600);
});

document.addEventListener("pointerup", () => {
  clearTimeout(longPressTimer);
});
