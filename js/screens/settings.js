// js/screens/settings.js

import { getState, updateState } from "../state.js";
import { getAppDayKey } from "../day.js";

export function renderSettings() {
  const state = getState();

  return `
    <section class="settings">
      <h1>Settings</h1>

      <!-- PROFILE -->
      <div class="settings-card">
        <h2>Profile</h2>
        <label>
          Name
          <input type="text" id="settings-name" value="${state.settings.name}">
        </label>
      </div>

      <!-- TARGETS -->
      <div class="settings-card">
        <h2>Targets</h2>

        <label>
          Daily Calorie Target
          <input type="number" id="settings-calories" value="${state.settings.calorieTarget}">
        </label>

        <label>
          Daily Step Target
          <input type="number" id="settings-steps" value="${state.settings.stepTarget}">
        </label>
      </div>

      <!-- HABITS -->
      <div class="settings-card">
        <h2>Habits</h2>

        <div id="habit-list">
          ${state.habits.length
            ? state.habits.map(h => `
                <div class="habit-row">
                  <span>${h.name}</span>
                  <button data-remove-habit="${h.id}">Remove</button>
                </div>
              `).join("")
            : `<p class="muted">No habits defined</p>`
          }
        </div>

        <div class="habit-add">
          <input type="text" id="new-habit-name" placeholder="New habit">
          <button id="add-habit">Add</button>
        </div>
      </div>

      <!-- DATA -->
      <div class="settings-card">
        <h2>Data</h2>

        <button id="reset-today">Reset Today</button>
        <button id="sync-github">Sync with GitHub</button>
      </div>
    </section>
  `;
}

/* ---------- WIRING ---------- */

export function bindSettingsEvents() {
  const state = getState();

  // Name
  document.getElementById("settings-name").onchange = e => {
    updateState(s => {
      s.settings.name = e.target.value.trim() || s.settings.name;
    });
  };

  // Targets
  document.getElementById("settings-calories").onchange = e => {
    updateState(s => {
      s.settings.calorieTarget = Number(e.target.value) || s.settings.calorieTarget;
    });
  };

  document.getElementById("settings-steps").onchange = e => {
    updateState(s => {
      s.settings.stepTarget = Number(e.target.value) || s.settings.stepTarget;
    });
  };

  // Add habit
  document.getElementById("add-habit").onclick = () => {
    const input = document.getElementById("new-habit-name");
    const name = input.value.trim();
    if (!name) return;

    updateState(s => {
      s.habits.push({
        id: crypto.randomUUID(),
        name
      });
    });

    location.reload();
  };

  // Remove habit
  document.querySelectorAll("[data-remove-habit]").forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.removeHabit;
      updateState(s => {
        s.habits = s.habits.filter(h => h.id !== id);
      });
      location.reload();
    };
  });

  // Reset today
  document.getElementById("reset-today").onclick = () => {
    const todayKey = getAppDayKey();
    updateState(s => {
      const d = s.history[todayKey];
      if (!d) return;
      d.calories = { breakfast:{}, lunch:{}, snacks:{}, dinner:{} };
      d.steps = 0;
      d.habits = {};
    });
    location.reload();
  };

  // GitHub sync (placeholder)
  document.getElementById("sync-github").onclick = () => {
    alert("GitHub sync coming next");
  };
}
