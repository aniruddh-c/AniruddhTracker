// js/screens/weight.js

import { getState } from "../state.js";

export function renderWeight() {
  const state = getState();

  const latestWeight =
    state.weight.length > 0
      ? state.weight[state.weight.length - 1].value
      : "—";

  return `
    <section class="weight">
      <h1>Weight</h1>

      <div class="weight-card">
        <div class="weight-value">${latestWeight} kg</div>
        <div class="weight-label">Current weight</div>
      </div>

      <div class="weight-graph-placeholder">
        Weight trend will appear here
      </div>

      <button class="weight-add-btn" disabled>
        Add weight
      </button>
    </section>
  `;
}
