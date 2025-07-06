export default (overwrite, guildId) => {
  if (overwrite.type === 0) {
    if (overwrite.id === guildId) {
      return '@everyone';
    } else {
      return `<@&${overwrite.id}>`;
    }
  } else {
    return `<@${overwrite.id}>`;
  }
  //return `- <${overwrite.type === 0 && overwrite.type !== guildId ? '@&' : '@'}${overwrite.id}>`;
}