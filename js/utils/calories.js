// js/utils/calories.js

export function computeDailyCalories(day) {
  if (!day?.calories) return 0;

  let total = 0;
  for (const meal of Object.values(day.calories)) {
    for (const [_, count] of Object.entries(meal)) {
      // count × unit calories is handled by caller that knows unit values
      // Here we assume callers pass in totals already aggregated per item
      total += count; // placeholder, overridden by caller
    }
  }
  return total;
}