const RESET_HOUR = 3; // 3 AM

/**
 * Returns a Date object shifted back by RESET_HOUR
 * so that 3 AM becomes the logical start of the day.
 */
export function getAppDate(date = new Date()) {
  const shifted = new Date(date);
  shifted.setHours(shifted.getHours() - RESET_HOUR);
  return shifted;
}


/**
 * Returns internal day key: YYYY-MM-DD
 */
export function getAppDayKey(date = new Date()) {
  const d = getAppDate(date);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}


/**
 * Formats a date for UI: DD-MM-YYYY
 */
export function formatDateForUI(date = new Date()) {
  const d = getAppDate(date);

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}-${month}-${year}`;
}

/**
 * Returns a Date object representing Monday of the current app-week
 */
export function getStartOfWeek(date = new Date()) {
  const d = getAppDate(date);
  const weekdayIndex = getWeekdayIndex(d);

  const monday = new Date(d);
  monday.setDate(d.getDate() - weekdayIndex);

  return monday;
}


