module.exports = async (text, maxLength = 1024) => {
  if (text.length <= maxLength) return text;

  const ellipsis = '...';
  const adjustedMaxLength = maxLength - ellipsis.length;

  const trimmed = text.slice(0, adjustedMaxLength).trimEnd();
  const lastSpaceIndex = trimmed.lastIndexOf(' ');

  const finalText = lastSpaceIndex > 0 ? trimmed.slice(0, lastSpaceIndex) : trimmed;

  return finalText + ellipsis;
}