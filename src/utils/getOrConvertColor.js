const ntc = require("ntc");

module.exports = async (input, output = false) => {
  let hexColor;
  let message;
  if (input.toLowerCase() === 'random') {
    hexColor = `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`;
    message = `Your random color is ${hexColor}`;
  } else if (input.startsWith('#', 0)) {
    const hexPattern = /^#([A-Fa-f0-9]{6})$/;

    if (hexPattern.test(input)) {
      hexColor = input
      message = `Your given color is ${input}`;
    } else {
      message = `The provided hex color "${input}" is not valid.`;
    }        
  } else {
    const colorMatch = ntc.names.find(([hex, name]) => name.toLowerCase() === input.toLowerCase());
    if (colorMatch) {
      hexColor = "#" + colorMatch[0];
      message = `Your given color name is ${colorMatch[1]} with hex #${colorMatch[0]}`
    } else {
      message = `The color name "${input}" was not found.`;
    }
  }
  if (output) {
    return { hexColor, message };
  } else {
    return hexColor;
  }
};
