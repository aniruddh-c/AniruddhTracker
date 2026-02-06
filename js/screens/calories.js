// js/screens/calories.js

import { getState, updateState } from "../state.js";
import { getAppDayKey } from "../day.js";

const DEFAULT_FOODS = {
  breakfast: {
    Eggs: 80,
    Bread: 70,
    Milk: 120,
    Cornflakes: 110
  },
  lunch: {
    Roti: 100,
    Dal: 150,
    Chicken: 250
  },
  snacks: {
    Biscuits: 100,
    Fruit: 80
  },
  dinner: {
    Roti: 100,
    Dal: 150,
    Chicken: 250
  }
};

function renderFoodItem(meal, name, calories, value) {
  return `
    <div class="food">
      <span class="food-name">${name}</span>
      <div class="food-controls">
        <button data-action="dec" data-meal="${meal}" data-name="${name}">−</button>
        <span class="food-value">${value || 0}</span>
        <button data-action="inc" data-meal="${meal}" data-name="${name}">+</button>
      </div>
      <span class="food-cal">${calories} cal</span>
    </div>
  `;
}

export function renderCalories() {
  const state = getState();
  const todayKey = getAppDayKey();
  const today = state.history[todayKey];

  function renderMeal(meal) {
    const foods = DEFAULT_FOODS[meal];
    const mealData = today.calories[meal];

    const items = Object.entries(foods)
      .map(([name, cal]) =>
        renderFoodItem(meal, name, cal, mealData[name])
      )
      .join("");

    return `
      <div class="meal">
        <h2>${meal[0].toUpperCase() + meal.slice(1)}</h2>
        <div class="meal-items">${items}</div>
      </div>
    `;
  }

  return `
    <section class="calories">
      <h1>Calories</h1>
      ${renderMeal("breakfast")}
      ${renderMeal("lunch")}
      ${renderMeal("snacks")}
      ${renderMeal("dinner")}
    </section>
  `;
}

/**
 * Handle + / − clicks
 */
document.addEventListener("click", async e => {
  const btn = e.target;
  if (!btn.dataset || !btn.dataset.action) return;

  const { action, meal, name } = btn.dataset;

  await updateState(state => {
    const todayKey = getAppDayKey();
    const today = state.history[todayKey];
    const foodCalories = DEFAULT_FOODS[meal][name];

    const current = today.calories[meal][name] || 0;

    if (action === "inc") {
      today.calories[meal][name] = current + foodCalories;
    }

    if (action === "dec") {
      today.calories[meal][name] = Math.max(
        0,
        current - foodCalories
      );
    }
  });
});
