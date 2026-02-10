// js/screens/home.js

import { getState } from "../state.js";
import { createSemiArc } from "../ui/arcs.js";
import { formatDateForUI } from "../day.js";
import { getAppDayKey } from "../day.js";
import { renderHeader } from "../ui/header.js";

/*
  Default food calories (must match calories.js)
*/
const DEFAULT_FOOD_CALORIES = {
  breakfast: {
    Eggs: 80,
    Bread: 70,
    Milk: 120,
    Cornflakes: 110
  },
  lunch: {
    Roti: 100,
    Dal: 150,
    Chicken: 250
  },
  snacks: {
    Biscuits: 100,
    Fruit: 80
  },
  dinner: {
    Roti: 100,
    Dal: 150,
    Chicken: 250
  }
};

function formatHeaderDate() {
  const today = new Date();

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(today);
}

function getGreeting(name) {
  const hour = new Date().getHours();
  if (hour < 12) return `Good morning, ${name} 👋`;
  if (hour < 18) return `Good afternoon, ${name} 👋`;
  return `Good evening, ${name} 👋`;
}

/**
 * Compute total calories eaten today
 * Includes default + custom foods
 */
function computeCaloriesEaten(state, today) {
  let total = 0;

  for (const meal in today.calories) {
    const mealCounts = today.calories[meal] || {};

    // Default foods
    const defaults = DEFAULT_FOOD_CALORIES[meal] || {};
    for (const food in defaults) {
      const count = mealCounts[food] ?? 0;
      total += count * defaults[food];
    }

    // Custom foods
    const customFoods = state.customFoods?.[meal] || [];
    for (const food of customFoods) {
      const count = mealCounts[food.name] ?? 0;
      total += count * food.calories;
    }
  }

  return total;
}

/* ---------- HABITS RENDERING ---------- */

function renderHabits(state, today) {
  const habits = state.habits || [];

  if (habits.length === 0) {
    return `
      <div class="habits-card empty">
        <div class="habits-empty">No habits defined</div>
      </div>
    `;
  }

  const items = habits.map(habit => {
    const done = !!today.habits?.[habit.id];

    return `
      <label class="habit-item ${done ? "done" : ""}">
        <input
          type="checkbox"
          data-habit-id="${habit.id}"
          ${done ? "checked" : ""}
        />
        <span class="habit-name">${habit.name}</span>
      </label>
    `;
  });

  return `
    <div class="habits-card">
      <div class="habits-list">
        ${items.join("")}
      </div>
    </div>
  `;
}

/* ---------- MAIN HOME ---------- */

export function renderHome() {
  const state = getState();
  const todayKey = getAppDayKey();
  const today = state.history[todayKey];


  /* ---- CALORIES ---- */
  const caloriesEaten = computeCaloriesEaten(state, today);
  const calorieTarget = state.settings.calorieTarget;
  const caloriesLeft = Math.max(0, calorieTarget - caloriesEaten);

  /* ---- STEPS ---- */
  const steps = today.steps || 0;
  const stepTarget = state.settings.stepTarget;
  const stepsLeft = Math.max(0, stepTarget - steps);

  /* ---- WEIGHT ---- */
  const latestWeight =
    state.weight.length > 0
      ? state.weight[state.weight.length - 1].value
      : "—";

  return `
    <section class="home">
      ${renderHeader(
    getGreeting(state.settings.name),
    formatHeaderDate(),
    { noCaps: true }
  )}

      <div class="arc-row">
        ${createSemiArc({
          value: caloriesEaten,
          max: calorieTarget,
          label: `${caloriesLeft} left`,
          color: "#ff9100"
        })}

        ${createSemiArc({
          value: steps,
          max: stepTarget,
          label: `${stepsLeft} left`,
          color: "#7c4dff"
        })}
      </div>

      <div class="weight-card">
        <div class="weight-label">Current Weight</div>
        <div class="weight-value">${latestWeight} kg</div>
      </div>

      <h2 class="habits-title">Habits</h2>
      ${renderHabits(state, today)}
    </section>
  `;
}
