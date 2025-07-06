
export default (member) => {
  return member.roles.cache
  .filter(role => role.name !== '@everyone')
  .map(role => role.id);
}