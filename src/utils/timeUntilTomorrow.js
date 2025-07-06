export default () => {
  const now = new Date();
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const timeDifference = tomorrow - now;
  return timeDifference;
}