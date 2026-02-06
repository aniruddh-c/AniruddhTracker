// js/screens/home.js

import { getState } from "../state.js";
import { createSemiArc } from "../ui/arcs.js";
import { formatDateForUI } from "../day.js";

/*
  MUST match DEFAULT_FOODS used in calories.js
  (Later we’ll centralize this into a shared file)
*/
const FOOD_CALORIES = {
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
 * Σ(count × unitCalories)
 */
function computeCaloriesEaten(today) {
  let total = 0;

  for (const meal in today.calories) {
    const foods = today.calories[meal];
    const calorieMap = FOOD_CALORIES[meal];

    for (const foodName in foods) {
      const count = foods[foodName] || 0;
      const unitCalories = calorieMap?.[foodName] || 0;
      total += count * unitCalories;
    }
  }

  return total;
}

export function renderHome() {
  const state = getState();
  const todayKey = Object.keys(state.history).slice(-1)[0];
  const today = state.history[todayKey];

  const caloriesEaten = computeCaloriesEaten(today);
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
