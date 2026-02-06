// js/screens/home.js

import { getState } from "../state.js";
import { createSemiArc } from "../ui/arcs.js";
import { formatDateForUI } from "../day.js";

function getGreeting(name) {
  const hour = new Date().getHours();
  if (hour < 12) return `Good morning, ${name} 👋`;
  if (hour < 18) return `Good afternoon, ${name} 👋`;
  return `Good evening, ${name} 👋`;
}

export function renderHome() {
  const state = getState();
  const todayKey = Object.keys(state.history).slice(-1)[0];
  const today = state.history[todayKey];

  const caloriesEaten = Object.values(today.calories)
    .flatMap(meal => Object.values(meal))
    .reduce((a, b) => a + b, 0);

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
          max: state.settings.calorieTarget,
          label: "Calories",
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
