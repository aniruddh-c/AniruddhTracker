// js/router.js

const tabs = ["home", "calories", "steps", "settings"];
let currentTab = "home";
const listeners = [];

export function navigate(tab) {
  if (!tabs.includes(tab)) return;
  if (tab === currentTab) return;

  currentTab = tab;
  listeners.forEach(fn => fn(tab));
}

export function onRouteChange(fn) {
  listeners.push(fn);
}

export function getCurrentTab() {
  return currentTab;
}

export function getNextTab(direction) {
  const index = tabs.indexOf(currentTab);
  if (direction === "left" && index < tabs.length - 1) {
    return tabs[index + 1];
  }
  if (direction === "right" && index > 0) {
    return tabs[index - 1];
  }
  return null;
}
