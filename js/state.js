// // js/state.js

// import { loadState, saveState } from "./storage.js";
// import { getAppDayKey } from "./day.js";

// let state = null;

// /**
//  * Default app state (first run)
//  */
// function getDefaultState() {
//   return {
//     settings: {
//       name: "Aniruddh",
//       resetHour: 3,
//       calorieTarget: 2200,
//       stepTarget: 15000,
//       github: {
//         connected: false,
//         gistId: null
//       }
//     },
//     history: {},
//     weight: [],
//     habits: [],
//     customFoods: {
//       breakfast: [],
//       lunch: [],
//       snacks: [],
//       dinner: []
//     }
//   };
// }

// /**
//  * Initialize state from storage
//  */
// export async function initState() {
//   const stored = await loadState();
//   state = stored || getDefaultState();

//   state.customFoods ??= {
//     breakfast: [],
//     lunch: [],
//     snacks: [],
//     dinner: []
//   };

//   // Ensure today exists
//   const todayKey = getAppDayKey();
//   if (!state.history[todayKey]) {
//     state.history[todayKey] = {
//       calories: {
//         breakfast: {},
//         lunch: {},
//         snacks: {},
//         dinner: {}
//       },
//       steps: 0,
//       habits: {}
//     };
//   }

//   await saveState(state);
//   return state;
// }

// /**
//  * Get full state (read-only reference)
//  */
// export function getState() {
//   return state;
// }

// /**
//  * Update state and persist
//  */
// export async function updateState(mutatorFn) {
//   mutatorFn(state);
//   await saveState(state);
// }



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
      stepTarget: 15000,
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

  // Ensure customFoods exists
  state.customFoods ??= {
    breakfast: [],
    lunch: [],
    snacks: [],
    dinner: []
  };

  // Ensure habits array exists
  state.habits ??= [];

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

  /* =========================================================
     TEMPORARY TEST DATA — REMOVE AFTER TESTING
     ========================================================= */

  // Add sample habits only if none exist
  if (state.habits.length === 0) {
    state.habits = [
      { id: "water", name: "Drink enough water" },
      { id: "walk", name: "Go for a walk" },
      { id: "sleep", name: "Sleep before 12" }
    ];
  }

  // 8 FEB 2026 — SUCCESS DAY
  state.history["2026-02-08"] = {
    calories: {
      breakfast: { Eggs: 2 },
      lunch: { Roti: 2, Dal: 1 },
      snacks: { Fruit: 1 },
      dinner: { Roti: 2, Chicken: 1 }
    },
    steps: 16000, // ≥ 15000 → success
    habits: {
      water: true,
      walk: true,
      sleep: true
    }
  };

  // 9 FEB 2026 — FAILURE DAY
  state.history["2026-02-09"] = {
    calories: {
      breakfast: { Eggs: 3, Bread: 2 },
      lunch: { Roti: 4, Chicken: 2 },
      snacks: { Biscuits: 2 },
      dinner: { Roti: 3, Chicken: 2 }
    },
    steps: 6000, // < 15000 → failure
    habits: {
      water: true,
      walk: false, // missed habit
      sleep: true
    }
  };

  /* ========================================================= */

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
