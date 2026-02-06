import { initState } from "./state.js";
import { navigate, onRouteChange } from "./router.js";
import { renderHome } from "./screens/home.js";

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
