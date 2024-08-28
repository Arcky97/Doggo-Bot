module.exports = (level) => {
  const initialXp = 35;
  const incrStep = 40;

  let totalXp = initialXp;
  let currIncr = 20;
  let lev = 2;
  if (level > 1) {
    while (lev <= level) {
      console.log(level)
      totalXp += currIncr;
      currIncr += incrStep;
      lev++;
    }
  }
  console.log(`Level ${level} requires a total of ${totalXp} XP.`)
  return totalXp
};

