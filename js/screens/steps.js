// js/screens/steps.js

import { getState } from "../state.js";
import { getAppDayKey } from "../day.js";

export function renderSteps() {
  const state = getState();
  const todayKey = getAppDayKey();
  const today = state.history[todayKey];

  const steps = today.steps || 0;
  const target = state.settings.stepTarget;

  return `
    <section class="steps">
      <h1>Steps</h1>

      <div class="steps-card">
        <div class="steps-value">${steps}</div>
        <div class="steps-label">steps today</div>
      </div>

      <div class="steps-controls">
        <button disabled>−100</button>
        <button disabled>+100</button>
        <button disabled>+500</button>
      </div>

      <div class="steps-target">
        Target: ${target} steps
      </div>
    </section>
  `;
}
