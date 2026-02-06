// js/state.js

import { loadState, saveState } from "./storage.js";
import { getAppDayKey } from "./day.js";

let state = null;

/**
 * Default app state (first run)
 */
function getDefaultState() {
  return {
    settings: {
      name: "Aniruddh",
      resetHour: 3,
      calorieTarget: 2200,
      stepTarget: 8000,
      github: {
        connected: false,
        gistId: null
      }
    },
    history: {},
    weight: [],
    habits: [],
    customFoods: {
      breakfast: [],
      lunch: [],
      snacks: [],
      dinner: []
    }
  };
}

/**
 * Initialize state from storage
 */
export async function initState() {
  const stored = await loadState();
  state = stored || getDefaultState();

  state.customFoods ??= {
    breakfast: [],
    lunch: [],
    snacks: [],
    dinner: []
  };

  // Ensure today exists
  const todayKey = getAppDayKey();
  if (!state.history[todayKey]) {
    state.history[todayKey] = {
      calories: {
        breakfast: {},
        lunch: {},
        snacks: {},
        dinner: {}
      },
      steps: 0,
      habits: {}
    };
  }

  await saveState(state);
  return state;
}

/**
 * Get full state (read-only reference)
 */
export function getState() {
  return state;
}

/**
 * Update state and persist
 */
export async function updateState(mutatorFn) {
  mutatorFn(state);
  await saveState(state);
}
