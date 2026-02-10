import { initState } from "./state.js";
import { navigate, onRouteChange, getNextTab } from "./router.js";
import { renderHome } from "./screens/home.js";
import { renderCalories } from "./screens/calories.js";
import { renderSteps } from "./screens/steps.js";
import { updateState } from "./state.js";
import { getAppDayKey } from "./day.js";
import { renderWeight } from "./screens/weight.js";


console.log("Aniruddh's Tracker loaded");

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js");
  });
}

(async () => {
  await initState();

  const app = document.getElementById("app");
  const screen = document.getElementById("screen");
  const buttons = document.querySelectorAll("#bottom-nav button");

  function render(tab) {
    if (tab === "home") {
      screen.innerHTML = renderHome();
    } else if (tab === "calories") {
      screen.innerHTML = renderCalories();
    } else if (tab === "steps") {
      screen.innerHTML = renderSteps();
    } else if (tab === "weight") {
      screen.innerHTML = renderWeight();
    } else if (tab === "settings") {
      screen.innerHTML = `
        <section class="settings">
          <h1>Settings</h1>
          <p style="color:#aaa;font-size:0.875rem;">
            Settings screen coming soon
          </p>
        </section>
      `;
    } else {
      screen.innerHTML = `<h2>${tab.toUpperCase()}</h2>`;
    }

    buttons.forEach(btn =>
      btn.classList.toggle("active", btn.dataset.tab === tab)
    );
  }


  onRouteChange(render);

  buttons.forEach(btn => {
    btn.addEventListener("click", () => navigate(btn.dataset.tab));
  });

  // ---- SWIPE HANDLING ----
  let touchStartX = 0;
  let touchStartY = 0;

  app.addEventListener(
    "touchstart",
    e => {
      const t = e.touches[0];
      touchStartX = t.clientX;
      touchStartY = t.clientY;
    },
    { passive: true }
  );

  app.addEventListener("touchend", e => {
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartX;
    const dy = t.clientY - touchStartY;

    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    // Clear horizontal swipe only
    if (absX > absY && absX > 60) {
      const direction = dx < 0 ? "left" : "right";
      const next = getNextTab(direction);
      if (next) navigate(next);
    }
  });

  // Initial render
  render("home");
})();

document.addEventListener("click", async e => {
  if (!e.target.dataset?.editSteps) return;

  const input = prompt("Enter total steps for today:");
  if (input === null) return;

  const steps = Number(input);
  if (!Number.isInteger(steps) || steps < 0) {
    alert("Please enter a valid non-negative number");
    return;
  }

  await updateState(state => {
    const todayKey = getAppDayKey();
    state.history[todayKey].steps = steps;
  });

  // Re-render
  navigate("home");
  navigate("steps");
});

document.addEventListener("click", async e => {
  if (!e.target.dataset?.addWeight) return;

  const input = prompt("Enter your current weight (kg):");
  if (input === null) return;

  const value = Number(input);
  if (!Number.isFinite(value) || value <= 0) {
    alert("Please enter a valid positive number");
    return;
  }

  await updateState(state => {
    const dayKey = getAppDayKey();

    state.weight.push({
      date: dayKey,
      value
    });
  });

  // Refresh UI
  navigate("home");
  navigate("weight");
});