import { getState, updateState } from "../state.js";

/* ---------- OPEN MODAL ---------- */

export function openDayModal(dayKey, type) {
  const state = getState();
  const day = state.history[dayKey];

  if (!day) return;

  const modal = document.createElement("div");
  modal.className = "day-modal-backdrop";

  modal.innerHTML = `
    <div class="day-modal-card" role="dialog">
      <div class="day-modal-header">
        <div class="day-modal-title">${dayKey}</div>
        <button class="day-modal-edit">Edit</button>
      </div>

      <div class="day-modal-body">
        ${type === "habits" ? renderHabits(day, state) : renderHealth(day, state)}
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Close on backdrop tap
  modal.addEventListener("click", e => {
    if (e.target === modal) modal.remove();
  });

  // Edit button
  modal.querySelector(".day-modal-edit").onclick = () => {
    modal.querySelector(".day-modal-body").innerHTML =
      type === "habits"
        ? renderHabitsEdit(day, state)
        : renderHealthEdit(day, state, dayKey, modal);
  };
}

/* ---------- RENDER VIEWS ---------- */

function renderHabits(day, state) {
  if (!state.habits.length) return `<p>No habits defined</p>`;

  return state.habits.map(h => `
    <div class="modal-row ${day.habits?.[h.id] ? "done" : ""}">
      ${h.name}
    </div>
  `).join("");
}

function renderHealth(day, state) {
  return `
    <div class="modal-row">Steps: ${day.steps ?? 0}</div>
    <div class="modal-row">
      Calories: ${computeCalories(day, state)}
    </div>
  `;
}

/* ---------- EDIT MODES ---------- */

function renderHabitsEdit(day, state) {
  return `
    ${state.habits.map(h => `
      <label class="modal-checkbox">
        <input type="checkbox" data-habit="${h.id}" ${day.habits?.[h.id] ? "checked" : ""}>
        ${h.name}
      </label>
    `).join("")}

    <button class="modal-save">Save</button>
  `;
}

function renderHealthEdit(day, state, dayKey, modal) {
  return `
    <label class="modal-input">
      Steps
      <input type="number" id="edit-steps" value="${day.steps ?? 0}">
    </label>

    <button class="modal-save">Save</button>
  `;
}

/* ---------- UTIL ---------- */

function computeCalories(day, state) {
  let total = 0;
  for (const meal in day.calories) {
    for (const item in day.calories[meal]) {
      total += day.calories[meal][item] * 1;
    }
  }
  return total;
}
