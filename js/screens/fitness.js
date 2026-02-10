// js/screens/fitness.js

import { getState } from "../state.js";
import { getAppDayKey } from "../day.js";

export function renderFitness() {
  const state = getState();
  const todayKey = getAppDayKey();
  const today = state.history[todayKey];

  /* ---- STEPS ---- */
  const steps = today.steps || 0;
  const stepTarget = state.settings.stepTarget;

  /* ---- WEIGHT ---- */
  const weightEntries = state.weight;
  const latestWeight =
    weightEntries.length > 0
      ? weightEntries[weightEntries.length - 1].value
      : "—";

  return `
    <section class="fitness">
      <h1>Fitness</h1>

      <!-- STEPS SECTION -->
      <div class="fitness-section">
        <h2>Steps</h2>

        <div class="steps-card">
          <div class="steps-value">${steps} / ${stepTarget}</div>
          <div class="steps-label">steps today</div>
        </div>

        <button class="steps-edit-btn" data-edit-steps="true">
          Enter steps
        </button>
      </div>

      <!-- WEIGHT SECTION -->
      <div class="fitness-section">
        <h2>Weight</h2>

        <div class="weight-card">
          <div class="weight-value">${latestWeight} kg</div>
          <div class="weight-label">Current weight</div>
        </div>

        <div class="weight-graph-placeholder">
          Weight trend will appear here
        </div>

        <button class="weight-add-btn" data-add-weight="true">
          Add weight
        </button>
      </div>
    </section>
  `;
}
