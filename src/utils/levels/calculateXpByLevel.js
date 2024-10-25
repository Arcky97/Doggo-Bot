module.exports = (level) => {
  const initialXp = 35;
  const incrStep = 40;

  let totalXp = initialXp;
  let currIncr = 20;
  let lev = 0;
  if (level > 0) {
    while (lev < level) {
      totalXp += currIncr;
      currIncr += incrStep;
      lev++;
    }
  }
  return totalXp
};

