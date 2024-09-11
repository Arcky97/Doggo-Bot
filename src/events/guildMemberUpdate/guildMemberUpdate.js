const { Client, GuildMember, EmbedBuilder } = require('discord.js');
const getMemberRoles = require('../../utils/getMemberRoles');
const getLogChannel = require('../../utils/getLogChannel');

module.exports = async (client, oldMember, newMember) => {
  try {

    const channel = await getLogChannel(client, newMember.guild.id, 'member');
    if (!channel) return;

    console.log(channel);
    const oldRoles = getMemberRoles(oldMember);
    const newRoles = getMemberRoles(newMember);
    const oldNickName = oldMember.nickname;
    const newNickName = newMember.nickname;
    let action;
    let title;
    let description;
    let roles;
    if (oldRoles !== newRoles) {
      // role has changed
      if (oldRoles.length < newRoles.length) {
        // role added
        roles = newRoles.filter(role => !oldRoles.includes(role));
        action = 'added'
      } else {
        // role removed 
        roles = oldRoles.filter(role => !newRoles.includes(role));
        action = 'removed'
      }
      const roleMentions = roles.map(roleId => `<@${roleId}>`);
      title = `${roles.length > 1 ? 'Roles' : 'Role'} ${action}`
      description = roleMentions.join(', ')
    } else if (oldNickName !== newNickName) {
      title = 'Nickname change';
      description = `Before: ${oldNickName}\nAfter: ${newNickName}`;
    }
    //const embed = createEmbed(newMember, title, description);
    const embed = new EmbedBuilder()
      .setColor('Blue')
      .setAuthor({
        name: newMember.user.globalName,
        iconURL: newMember.user.avatarURL()
      })
      .setTitle(title)
      .setDescription(description)
      .setTimestamp()
      .setFooter({
        text: `User ID: ${newMember.user.id}`
      });
    await channel.send({ embeds: [embed] })
    console.log(`${oldMember.user.username} updated their profile!`);
  } catch (error) {
    console.error('Failed to log Member update!', error)
  }
}