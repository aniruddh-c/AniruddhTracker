// js/screens/calories.js

import { getState, updateState } from "../state.js";
import { getAppDayKey } from "../day.js";
import { navigate } from "../router.js";

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

function renderFoodItem(meal, name, unitCalories, count = 0) {
  return `
    <div class="food">
      <span class="food-name editable" data-edit-food="${meal}|${name}">${name}</span>

      <span class="food-cal">
        ${unitCalories} cal
      </span>

      <div class="counter-box">
        <button data-action="dec" data-meal="${meal}" data-name="${name}">−</button>
        <span class="counter-value">${count}</span>
        <button data-action="inc" data-meal="${meal}" data-name="${name}">+</button>
      </div>
    </div>
  `;
}

function renderAddFoodButton(meal) {
  return `
    <button class="add-food-btn" data-add-food="${meal}">
      + Add food
    </button>
  `;
}

export function renderCalories() {
  const state = getState();
  const todayKey = getAppDayKey();
  const today = state.history[todayKey];

  function renderMeal(meal) {
  const defaultFoods = DEFAULT_FOODS[meal];
  const customFoods = state.customFoods[meal] || {};
  const mealData = today.calories[meal] || {};

  let mealTotal = 0;

    const items = [
  ...Object.entries(defaultFoods).map(([name, unitCalories]) => {
    const count = mealData[name] ?? 0;
    mealTotal += count * unitCalories;
    return renderFoodItem(meal, name, unitCalories, count);
  }),
  ...customFoods.map(food => {
    const count = mealData[food.name] ?? 0;
    mealTotal += count * food.calories;
    return renderFoodItem(meal, food.name, food.calories, count);
  })
].join("");

  return `
  <div class="meal">
    <h2>
      ${meal[0].toUpperCase() + meal.slice(1)}
      <span class="meal-total">${mealTotal} cal</span>
    </h2>
    <div class="meal-items">${items}</div>
    ${renderAddFoodButton(meal)}
  </div>
`;
}

  let dayTotal = 0;
  return `
  <section class="calories" data-day-total="${dayTotal}">
    <h1>Calories</h1>
    ${renderMeal("breakfast")}
    ${renderMeal("lunch")}
    ${renderMeal("snacks")}
    ${renderMeal("dinner")}
  </section>
`;
}

/* ---------- EVENT HANDLING ---------- */

document.addEventListener("click", async e => {
  const btn = e.target;
  if (!btn.dataset?.action) return;

  const { action, meal, name } = btn.dataset;

  await updateState(state => {
    const todayKey = getAppDayKey();
    const today = state.history[todayKey];

    const current = today.calories[meal][name] ?? 0;

    if (action === "inc") {
      today.calories[meal][name] = current + 1;
    } else if (action === "dec") {
      today.calories[meal][name] = Math.max(0, current - 1);
    }
  });

  // Force re-render
  navigate("home");
  navigate("calories");
});

document.addEventListener("click", async e => {
  const meal = e.target.dataset?.addFood;
  if (!meal) return;

  const name = prompt("Food name:");
  if (!name) return;

  const calories = Number(prompt("Calories per unit:"));
  if (!calories || calories <= 0) return;

  await updateState(state => {
    const exists = state.customFoods[meal].some(
      f => f.name.toLowerCase() === name.toLowerCase()
    );

    if (exists) {
      alert("Food already exists for this meal");
      return;
    }

    state.customFoods[meal].push({ name, calories });
  });

  // Re-render
  navigate("home");
  navigate("calories");
});

document.addEventListener("click", async e => {
  const data = e.target.dataset?.editFood;
  if (!data) return;

  const [meal, oldName] = data.split("|");
  const state = getState();

  const food = state.customFoods[meal]?.find(f => f.name === oldName);
  if (!food) return; // default foods ignored

  const newName = prompt("Edit food name:", food.name);
  if (!newName) return;

  const newCalories = Number(
    prompt("Calories per unit:", food.calories)
  );
  if (!newCalories || newCalories <= 0) return;

  const confirmDelete = confirm("Delete this food?");
  if (confirmDelete) {
    await updateState(state => {
      state.customFoods[meal] = state.customFoods[meal].filter(
        f => f.name !== oldName
      );
    });
  } else {
    await updateState(state => {
      food.name = newName;
      food.calories = newCalories;
    });
  }

  navigate("home");
  navigate("calories");
});
