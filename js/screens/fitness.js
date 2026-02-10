// js/screens/fitness.js

import { getState } from "../state.js";
import { getAppDayKey, formatDateForUI } from "../day.js";
import { renderHeader } from "../ui/header.js";

/* ---------- GRAPH HELPERS ---------- */

function renderStepsGraph(entries) {
  if (entries.length < 2) {
    return `
      <div class="weight-graph-card">
        <div class="weight-graph-placeholder">
          Add steps for at least 2 days to see the trend
        </div>
      </div>
    `;
  }

  const width = 320;
  const height = 180;
  const padding = 32;

  const values = entries.map(e => e.steps);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = entries.map((e, i) => {
    const x =
      padding +
      (i / (entries.length - 1)) * (width - padding * 2);

    const y =
      height -
      padding -
      ((e.steps - min) / range) * (height - padding * 2);

    return { x, y, entry: e };
  });

  const polyline = points.map(p => `${p.x},${p.y}`).join(" ");

  return `
    <div class="weight-graph-card">
      <svg
        viewBox="0 0 ${width} ${height}"
        class="weight-graph"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern
            id="steps-grid"
            width="16"
            height="16"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r="1" fill="#222" />
          </pattern>
        </defs>

        <!-- Grid -->
        <rect
          x="${padding}"
          y="${padding}"
          width="${width - padding * 2}"
          height="${height - padding * 2}"
          fill="url(#steps-grid)"
        />

        <!-- Axes -->
        <line
          x1="${padding}"
          y1="${padding}"
          x2="${padding}"
          y2="${height - padding}"
          stroke="#333"
        />
        <line
          x1="${padding}"
          y1="${height - padding}"
          x2="${width - padding}"
          y2="${height - padding}"
          stroke="#333"
        />

        <!-- Steps line -->
        <polyline
          fill="none"
          stroke="#7c4dff"
          stroke-width="2"
          points="${polyline}"
        />

        <!-- Data points -->
        ${points
          .map(
            p => `
          <circle cx="${p.x}" cy="${p.y}" r="4" fill="#7c4dff">
            <title>
              ${formatDateForUI(p.entry.date)} — ${p.entry.steps} steps
            </title>
          </circle>
        `
          )
          .join("")}

        <!-- Y-axis labels -->
        <text x="4" y="${padding + 4}" font-size="10" fill="#777">
          ${max}
        </text>
        <text x="4" y="${height - padding}" font-size="10" fill="#777">
          ${min}
        </text>
      </svg>
    </div>
  `;
}

/* ---------- MAIN RENDER ---------- */

export function renderFitness() {
  const state = getState();
  const todayKey = getAppDayKey();
  const today = state.history[todayKey];

  /* ---- STEPS ---- */
  const steps = today.steps || 0;
  const stepTarget = state.settings.stepTarget;

  const stepEntries = Object.entries(state.history)
    .map(([date, day]) => ({
      date,
      steps: day.steps || 0
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  /* ---- WEIGHT ---- */
  const weightEntries = state.weight;
  const latestWeight =
    weightEntries.length > 0
      ? weightEntries[weightEntries.length - 1].value
      : "—";

  return `
    <section class="fitness">
      ${renderHeader("Fitness")}

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

        ${renderStepsGraph(stepEntries)}
      </div>

      <!-- WEIGHT SECTION -->
      <div class="fitness-section">
        <h2>Weight</h2>

        <div class="weight-card">
          <div class="weight-value">${latestWeight} kg</div>
          <div class="weight-label">Current weight</div>
        </div>

        ${/* reuse existing weight graph from previous phase */ ""}
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
