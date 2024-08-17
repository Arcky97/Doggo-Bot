const setActivity = require("../../utils/setActivity");

module.exports = async (client, member) => {
  try {
    console.log(member);
    console.log(`${member.user.username} left ${member.guild.name}!`);
    await setActivity(client)
  } catch (error) {
    console.error('Failed to update Activity!')
  }
}