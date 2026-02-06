// js/router.js

let currentTab = "home";
const listeners = [];

/**
 * Change active tab
 */
export function navigate(tab) {
  if (tab === currentTab) return;
  currentTab = tab;
  listeners.forEach(fn => fn(tab));
}

/**
 * Subscribe to tab changes
 */
export function onRouteChange(fn) {
  listeners.push(fn);
}

/**
 * Get current tab
 */
export function getCurrentTab() {
  return currentTab;
}
