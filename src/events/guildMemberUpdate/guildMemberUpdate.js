const { Client, GuildMember, EmbedBuilder } = require('discord.js');
const getMemberRoles = require('../../utils/getMemberRoles');
const getLogChannel = require('../../utils/getLogChannel');

module.exports = async (client, oldMember, newMember) => {
  try {

    const channel = await getLogChannel(client, newMember.guild.id, 'member');
    if (!channel) return;

    const oldRoles = getMemberRoles(oldMember);
    const newRoles = getMemberRoles(newMember);
    const oldNickName = oldMember.nickname;
    const newNickName = newMember.nickname;
    let action;
    let title;
    let description;
    let fields = [];
    let roles;
    if (oldRoles.length !== newRoles.length) {
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
      const roleMentions = roles.map(roleId => `<@&${roleId}>`);
      title = `${roles.length > 1 ? 'Roles' : 'Role'} ${action}`
      description = roleMentions.join(', ')
    } else if (oldNickName !== newNickName) {
      title = 'Nickname change';
      fields.push({name: 'Before:', value: oldNickName});
      fields.push({name: 'After:', value: newNickName});
      //description = `Before: ${oldNickName}\nAfter+: ${newNickName}`;
    }
    //const embed = createEmbed(newMember, title, description);
    if (!title) return;
    
    let embed = new EmbedBuilder()
      .setColor('Blue')
      .setAuthor({
        name: newMember.user.globalName,
        iconURL: newMember.user.avatarURL()
      })
      .setTitle(title)
      .setTimestamp()
      .setFooter({
        text: `User ID: ${newMember.user.id}`
      });
    if (roles) {
      embed.setDescription(description);
    } else {
      fields.forEach((field) => {
        embed.addFields({
          name: field.name,
          value: field.value
        })
      });
    }
    await channel.send({ embeds: [embed] })
    console.log(`${oldMember.user.username} updated their profile!`);
  } catch (error) {
    console.error('Failed to log Member update!', error)
  }
}