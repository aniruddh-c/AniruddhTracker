// js/screens/home.js

import { getState } from "../state.js";
import { createSemiArc } from "../ui/arcs.js";
import { formatDateForUI } from "../day.js";

/*
  Default food calories
  (Must match calories.js)
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

function getGreeting(name) {
  const hour = new Date().getHours();
  if (hour < 12) return `Good morning, ${name} 👋`;
  if (hour < 18) return `Good afternoon, ${name} 👋`;
  return `Good evening, ${name} 👋`;
}

/**
 * Compute total calories eaten today
 * Includes BOTH default and custom foods
 */
function computeCaloriesEaten(state, today) {
  let total = 0;

  for (const meal in today.calories) {
    const mealCounts = today.calories[meal] || {};

    /* ---- DEFAULT FOODS ---- */
    const defaultFoods = DEFAULT_FOOD_CALORIES[meal] || {};
    for (const foodName in defaultFoods) {
      const count = mealCounts[foodName] ?? 0;
      total += count * defaultFoods[foodName];
    }

    /* ---- CUSTOM FOODS ---- */
    const customFoods = state.customFoods?.[meal] || [];
    for (const food of customFoods) {
      const count = mealCounts[food.name] ?? 0;
      total += count * food.calories;
    }
  }

  return total;
}

export function renderHome() {
  const state = getState();
  const todayKey = Object.keys(state.history).slice(-1)[0];
  const today = state.history[todayKey];

  const caloriesEaten = computeCaloriesEaten(state, today);
  const calorieTarget = state.settings.calorieTarget;
  const caloriesLeft = Math.max(0, calorieTarget - caloriesEaten);

  const steps = today.steps || 0;
  const latestWeight =
    state.weight.length > 0
      ? state.weight[state.weight.length - 1].value
      : "—";

  return `
    <section class="home">
      <h1>${getGreeting(state.settings.name)}</h1>
      <p class="date">${formatDateForUI()}</p>

      <div class="arc-row">
        ${createSemiArc({
          value: caloriesEaten,
          max: calorieTarget,
          label: `${caloriesLeft} left`,
          color: "#ff9100"
        })}

        ${createSemiArc({
          value: steps,
          max: state.settings.stepTarget,
          label: "Steps",
          color: "#7c4dff"
        })}
      </div>

      <div class="weight-card">
        <div class="weight-label">Current Weight</div>
        <div class="weight-value">${latestWeight} kg</div>
      </div>
    </section>
  `;
}
