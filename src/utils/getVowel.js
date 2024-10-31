module.exports = (text, combine = true) => {
  const vowel = ['a', 'e', 'i', 'o', 'u'];
  const firstLetter = text.charAt(0).toLowerCase();
  const article = (vowel.includes(firstLetter) ? 'an' : 'a');
  if (combine) {
    return `${article} ${text}`;
  } else {
    return article;
  }
}