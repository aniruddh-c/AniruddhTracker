// js/router.js

const tabs = ["home", "calories", "fitness", "settings"];

let currentTab = "home";
const listeners = new Set();

export function navigate(tab) {
  if (!tabs.includes(tab)) return;
  currentTab = tab;
  notify();
}

export function onRouteChange(fn) {
  listeners.add(fn);
  fn(currentTab);
}

export function getNextTab(direction) {
  const idx = tabs.indexOf(currentTab);
  if (idx === -1) return null;

  if (direction === "left" && idx < tabs.length - 1) {
    return tabs[idx + 1];
  }

  if (direction === "right" && idx > 0) {
    return tabs[idx - 1];
  }

  return null;
}

function notify() {
  listeners.forEach(fn => fn(currentTab));
}