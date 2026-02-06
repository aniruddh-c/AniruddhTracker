import { initState } from "./state.js";
import { navigate, onRouteChange } from "./router.js";
import { renderHome } from "./screens/home.js";
import { getNextTab } from "./router.js";

console.log("Aniruddh Tracker loaded");

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js");
  });
}

(async () => {
  await initState();

  const screen = document.getElementById("screen");
  const buttons = document.querySelectorAll("#bottom-nav button");

  function render(tab) {
    if (tab === "home") {
      screen.innerHTML = renderHome();
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

  render("home");
})();

let touchStartX = 0;
let touchStartY = 0;

screen.addEventListener("touchstart", e => {
  const t = e.touches[0];
  touchStartX = t.clientX;
  touchStartY = t.clientY;
});

screen.addEventListener("touchend", e => {
  const t = e.changedTouches[0];
  const dx = t.clientX - touchStartX;
  const dy = t.clientY - touchStartY;

  const absX = Math.abs(dx);
  const absY = Math.abs(dy);

  // Must be a clear horizontal swipe
  if (absX > absY && absX > 60) {
    const direction = dx < 0 ? "left" : "right";
    const next = getNextTab(direction);
    if (next) navigate(next);
  }
});
