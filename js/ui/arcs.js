// js/ui/arcs.js

/**
 * Create a semicircular progress arc
 * value: current value
 * max: target
 * label: text label
 */
export function createSemiArc({ value, max, label, color }) {
  const percent = Math.min(value / max, 1);
  const radius = 80;
  const circumference = Math.PI * radius;
  const offset = circumference * (1 - percent);

  return `
    <div class="arc">
      <svg viewBox="0 0 200 120" class="arc-svg">
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="#222"
          stroke-width="12"
        />
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="${color}"
          stroke-width="12"
          stroke-dasharray="${circumference}"
          stroke-dashoffset="${offset}"
          stroke-linecap="round"
        />
      </svg>
      <div class="arc-text">
        <div class="arc-value">${value}</div>
        <div class="arc-label">${label}</div>
      </div>
    </div>
  `;
}
