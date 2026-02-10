// js/screens/weight.js

import { getState } from "../state.js";
import { formatDateForUI } from "../day.js";

function renderWeightGraph(entries) {
  if (entries.length < 2) {
    return `
      <div class="weight-graph-placeholder">
        Add at least 2 entries to see the trend
      </div>
    `;
  }

  const width = 300;
  const height = 160;
  const padding = 20;

  const values = entries.map(e => e.value);
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
      ((e.value - min) / range) * (height - padding * 2);

    return `${x},${y}`;
  });

  const labels = entries.map((e, i) => {
    const x =
      padding +
      (i / (entries.length - 1)) * (width - padding * 2);

    return `
      <text
        x="${x}"
        y="${height - 4}"
        font-size="8"
        text-anchor="middle"
        fill="#777"
      >
        ${formatDateForUI(e.date)}
      </text>
    `;
  });

  return `
    <svg
      viewBox="0 0 ${width} ${height}"
      class="weight-graph"
      preserveAspectRatio="none"
    >
      <polyline
        fill="none"
        stroke="#7c4dff"
        stroke-width="2"
        points="${points.join(" ")}"
      />
      ${labels.join("")}
    </svg>
  `;
}

export function renderWeight() {
  const state = getState();
  const entries = state.weight;

  const latestWeight =
    entries.length > 0
      ? entries[entries.length - 1].value
      : "—";

  return `
    <section class="weight">
      <h1>Weight</h1>

      <div class="weight-card">
        <div class="weight-value">${latestWeight} kg</div>
        <div class="weight-label">Current weight</div>
      </div>

      ${renderWeightGraph(entries)}

      <button class="weight-add-btn" data-add-weight="true">
        Add weight
      </button>
    </section>
  `;
}
