const { getColorFromURL } = require('color-thief-node');

function rgbToHex(r, g, b) {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

async function getAccentColor(avatarUrl) {
  try {
    if (avatarUrl.includes('webp')) {
      return "#f97316";
    }
    const color = await getColorFromURL(avatarUrl);
    const dominantColor = rgbToHex(color[0], color[1], color[2]);
    return dominantColor
  } catch(error) {
    console.log('There was an error getting the Accent Color:', error);
  }
}

module.exports = { getAccentColor };