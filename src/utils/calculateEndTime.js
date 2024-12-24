/**
 * 
 * @param {*} input
 */

module.exports = (input) => {
  if (!input) return null;

  const regex = /^(\d+)\s*(tomorrow?|tmrw?|next\s*day?|next\s*week?|next\s*month?|next\s*year?|seconds?|secs?|minutes?|mins?|hours?|hrs?|days?|dys?|weeks?|wks?|months?|mos?|years?|yrs?)$/i;

  const match = input.match(regex);
  if ( match) {
    const amount = parseInt(match[1]);
    const unit = match[2].toLowerCase();

    const now = new Date();

    let endTime;

    if (unit === 'tomorrow' || unit === 'tmrw' || unit === 'next day') {
      endTime = new Date(now);
      endTime.setDate(now.getDate() + 1);
    } else if (unit === 'next week') {
      endTime = new Date(now);
      const daysUntilNextWeek = (8 - now.getDay()) % 7;
      endTime.setDate(now.getDate() + daysUntilNextWeek);
      endTime.setHours(0, 0, 0, 0);
    } else if (unit === 'next month') {
      endTime = new Date(now);
      endTime.setMonth(now.getMonth() + 1);
      endTime.setDate(1);
      endTime.setHours(0, 0, 0, 0);
    } else if (unit === 'next year') {
      endTime = new Date(now);
      endTime.setFullYear(now.getFullYear() + 1);
      endTime.setMonth(0);
      endTime.setDate(1);
      endTime.setHours(0, 0, 0, 0)
    } else {
      endTime = new Date(now);
      if (['seconds', 'second', 'secs', 'sec'].includes(unit)) {
        endTime.setSeconds(now.getSeconds() + amount);
      } else if (['minutes', 'minute', 'mins', 'min'].includes(unit)) {
        endTime.setMinutes(now.getMinutes() + amount);
      } else if (['hours', 'hour', 'hrs', 'hr'].includes(unit)) {
        endTime.setHours(now.getHours() + amount);
      } else if (['days', 'day', 'dys', 'dy'].includes(unit)) {
        endTime.setDate(now.getDate() + amount);
      } else if (['weeks', 'week', 'wks', 'wk'].includes(unit)) {
        endTime.setDate(now.getDate() + amount * 7);
      } else if (['months', 'month', 'mos', 'mo'].includes(unit)) {
        endTime.setMonth(now.getMonth() + amount);
      } else if (['years', 'year', 'yrs', 'yr'].includes(unit)) {
        endTime.setFullYear(now.getFullYear() + amount);
      }
    }

    const durationMs = endTime - now;
    return { now, endTime, durationMs };
  } else {
    return null;
  }
};