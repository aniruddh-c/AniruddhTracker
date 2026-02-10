// js/screens/steps.js

import { getState, updateState } from "../state.js";
import { getAppDayKey } from "../day.js";
import { navigate } from "../router.js";

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
        <div class="steps-value">
          ${steps} / ${target}
        </div>
        <div class="steps-label">steps today</div>
      </div>

      <div class="steps-hint">
        Enter the total number of steps you walked today
      </div>

      <button class="steps-edit-btn" data-edit-steps="true">
        Enter steps
      </button>
    </section>
  `;
}
