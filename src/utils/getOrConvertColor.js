import ntc from "ntc";
import { findClosestMatch } from "../managers/botRepliesManager.js";

export default async (input, output = false) => {
  let hexColor;
  let message;
  if (!input) return;
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
    const colorMatch = ntc.names.filter(([_, name]) => name.toLowerCase() === input.toLowerCase() || name.toLowerCase().includes(input.toLowerCase()));
    const closestMatch = await findClosestMatch(input, colorMatch.map(color => color[1]));
    const useColor = colorMatch.find(color => color[1] === closestMatch.matches[0]);

    if (useColor) {
      hexColor = "#" + useColor[0];
      message = `Your given color name is ${useColor[1]} with hex #${useColor[0]}`
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
