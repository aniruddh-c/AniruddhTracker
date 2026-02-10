// js/screens/weight.js

import { getState } from "../state.js";
import { formatDateForUI } from "../day.js";

function renderWeightGraph(entries) {
  if (entries.length < 2) {
    return `
      <div class="weight-graph-card">
        <div class="weight-graph-placeholder">
          Add at least 2 entries to see the trend
        </div>
      </div>
    `;
  }

  const width = 320;
  const height = 180;
  const padding = 32;

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

    return { x, y, entry: e };
  });

  const polylinePoints = points
    .map(p => `${p.x},${p.y}`)
    .join(" ");

  return `
    <div class="weight-graph-card">
      <svg
        viewBox="0 0 ${width} ${height}"
        class="weight-graph"
        preserveAspectRatio="none"
      >
        <defs>
          <!-- Dotted grid -->
          <pattern
            id="grid"
            width="16"
            height="16"
            patternUnits="userSpaceOnUse"
          >
            <rect width="16" height="16" fill="none" />
            <circle cx="1" cy="1" r="1" fill="#222" />
          </pattern>
        </defs>

        <!-- Background grid -->
        <rect
          x="${padding}"
          y="${padding}"
          width="${width - padding * 2}"
          height="${height - padding * 2}"
          fill="url(#grid)"
        />

        <!-- Y-axis -->
        <line
          x1="${padding}"
          y1="${padding}"
          x2="${padding}"
          y2="${height - padding}"
          stroke="#333"
          stroke-width="1"
        />

        <!-- X-axis -->
        <line
          x1="${padding}"
          y1="${height - padding}"
          x2="${width - padding}"
          y2="${height - padding}"
          stroke="#333"
          stroke-width="1"
        />

        <!-- Weight line -->
        <polyline
          fill="none"
          stroke="#7c4dff"
          stroke-width="2"
          points="${polylinePoints}"
        />

        <!-- Data points -->
        ${points
          .map(
            p => `
          <circle
            cx="${p.x}"
            cy="${p.y}"
            r="4"
            fill="#7c4dff"
          >
            <title>
              ${formatDateForUI(p.entry.date)} — ${p.entry.value} kg
            </title>
          </circle>
        `
          )
          .join("")}

        <!-- Y-axis labels (min / max) -->
        <text
          x="4"
          y="${padding + 4}"
          font-size="10"
          fill="#777"
        >
          ${max.toFixed(1)} kg
        </text>
        <text
          x="4"
          y="${height - padding}"
          font-size="10"
          fill="#777"
        >
          ${min.toFixed(1)} kg
        </text>
      </svg>
    </div>
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
