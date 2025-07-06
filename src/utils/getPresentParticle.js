export default (verb) => {
  // Split multi-word verbs
  const words = verb.split(' ');
  let mainVerb = words.pop();

  if (mainVerb.endsWith('e') && !mainVerb.endsWith('ee')) {
    // Rule 2: Drop the 'e' if the verb ends with 'e' but not 'ee'
    mainVerb = mainVerb.slice(0, -1) + 'ing';
  } else if (/^[^aeiou]*[aeiou][^aeiou]$/.test(mainVerb)) {
    // Rule 3: Double the final consonant if CVC pattern
    mainVerb = mainVerb + mainVerb.slice(-1) + 'ing';
  } else {
    // Rule 1: Add 'ing' directly
    mainVerb = mainVerb + 'ing';
  }

  // Recombine multi-word verbs
  return [...words, mainVerb].join(' ');
};