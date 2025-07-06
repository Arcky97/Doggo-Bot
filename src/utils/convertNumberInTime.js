export default (input, format) => {
  switch (format) {
    case 'Miliseconds':
    case 'Seconds':
      if (format === 'Miliseconds') input = Math.floor(input / 1000);
      if (input >= 604800) {
        return `${Math.floor(input / 604800)} week${input >= 1209600 ? 's' : ''}`;
      } else if (input >= 86400) {
        return `${Math.floor(input / 86400)} day${input >= 172800 ? 's' : ''}`;
      } else if (input >= 3600) {
        return `${Math.floor(input / 3600)} hour${input >= 7200 ? 's' : ''}`;
      } else if (input >= 60) {
        return `${Math.floor(input / 60)} minute${input >= 120 ? 's' : ''}`;
      } else {
        return `${input} second${input !== 1 ? 's' : ''}`;
      }
    case 'Minutes':
      if (input >= 10080) {
        return `${Math.floor(input / 10080)} week${input >= 20160 ? 's' : ''}`;
      } else if (input >= 1440) {
        return `${Math.floor(input / 1440)} day${input >= 2880 ? 's' : ''}`;
      } else if (input >= 60) {
        return `${Math.floor(input / 60)} hour${input >= 120 ? 's': ''}`;
      } else {
        return `${input} minute${input !== 1 ? 's' : ''}`;
      }
    case 'Hours':
      if (input >= 168) {
        return `${Math.floor(input / 168)} week${input >= 336 ? 's' : ''}`;
      } else if (input >= 24) {
        return `${Math.floor(input / 24)} day${input > 48 ? 's': ''}`;
      } else {
        return `${input} hour${input !== 1 ? 's' : ''}`;
      }
    default:
      throw new Error('Invalid format specified');
  }
};