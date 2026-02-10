// js/ui/editModal.js

import { getState, updateState } from "../state.js";

export function openEditModal(dayKey) {
  const state = getState();
  const day = state.history[dayKey];

  const habitsUI = (state.habits || []).map(h => {
    const checked = !!day.habits?.[h.id];
    return `
      <label>
        <input type="checkbox" data-habit="${h.id}" ${checked ? "checked" : ""} />
        ${h.name}
      </label>
    `;
  }).join("");

  const modal = document.createElement("div");
  modal.className = "edit-modal";
  modal.innerHTML = `
    <div class="edit-sheet">
      <h2>Edit ${dayKey}</h2>

      <section>
        <h3>Habits</h3>
        ${habitsUI || "<p>No habits defined</p>"}
      </section>

      <section>
        <h3>Steps</h3>
        <input type="number" id="edit-steps" value="${day.steps || 0}" />
      </section>

      <div class="actions">
        <button id="edit-save">Save</button>
        <button id="edit-cancel">Cancel</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector("#edit-cancel").onclick = () => modal.remove();

  modal.querySelector("#edit-save").onclick = async () => {
    await updateState(state => {
      const d = state.history[dayKey];
      d.steps = Number(modal.querySelector("#edit-steps").value) || 0;

      d.habits ??= {};
      modal.querySelectorAll("[data-habit]").forEach(cb => {
        d.habits[cb.dataset.habit] = cb.checked;
      });
    });

    modal.remove();
    location.reload(); // simple & safe re-render
  };
}
