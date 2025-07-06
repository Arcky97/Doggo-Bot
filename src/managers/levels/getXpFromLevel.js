export default (level, xpSettings) => {
  const initialXp = 35;
  const incrStep = xpSettings.step;

  let totalXp = initialXp;
  let currIncr = incrStep / 2;
  let lev = 0;
  if (level > 0) {
    while (lev < level - 1) {
      totalXp += currIncr;
      currIncr += incrStep;
      lev++;
    }
  }
  return totalXp
};