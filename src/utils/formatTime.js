const moment = require("moment");

module.exports = async (time, full = false) => {
  const timeInLocal = moment(time).local();
  const duration = moment.duration(moment().diff(timeInLocal));
  const years = Math.abs(duration.years());
  const months = Math.abs(duration.months());
  const weeks = Math.abs(duration.weeks());
  const days = Math.abs(duration.days() - (weeks * 7));
  const hours = Math.abs(duration.hours());
  const minutes = Math.abs(duration.minutes());
  const seconds = Math.abs(duration.seconds());
  const milSeconds = Math.abs(duration.milliseconds());
  
  const timeParts = [];

  if (years > 0) timeParts.push(years > 1 ? `${years} years` : `${years} year`);
  if (months > 0) timeParts.push(months > 1 ? `${months} months` : `${months} month`);
  if (weeks > 0) timeParts.push(weeks > 1 ? `${weeks} weeks` : `${weeks} week`);
  if (days > 0) timeParts.push(days > 1 ? `${days} days` : `${days} day`);
  if (hours > 0) timeParts.push(hours > 1 ? `${hours} hours` : `${hours} hour`);
  if (minutes > 0) timeParts.push(minutes > 1 ? `${minutes} minutes` : `${minutes} minute`);
  if (seconds > 0) timeParts.push(seconds > 1 ? `${seconds} seconds` : `${seconds} second`);
  if (milSeconds > 0) timeParts.push(milSeconds > 1 ? `${milSeconds} miliseconds` : `${milSeconds} milisecond`);
  
  let timeSpent;

  if (timeParts.length > 1) {
    const num = full ? timeParts.length : 3; 
    const selectedParts = timeParts.slice(0, num);

    const finalParts = timeParts.length > num ? [...selectedParts] : selectedParts;

    timeSpent = `${finalParts.slice(0, -1).join(', ')} and ${finalParts.slice(-1)}`;
  } else {
    timeSpent = timeParts[0];
  }

  return timeSpent;
};
