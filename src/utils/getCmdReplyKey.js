export default (targetClass, userId, targetId) => {
  if (!targetId) return "user";
  if (targetClass === 'default') {
    return 'member';
  } else if (userId === targetId) {
    return 'self';
  } else {
    return targetClass;
  }
};