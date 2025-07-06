export default (maxXp, xpSettings) => {
  const initialXp = 35;
  const step = xpSettings.step;

  const discriminant = 1 + 8 * ((maxXp - initialXp) / step);
  const maxLevel = Math.floor((-1 + Math.sqrt(discriminant)) / 2);
  return maxLevel;
}