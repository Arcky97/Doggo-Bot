const { Client, GuildMember, EmbedBuilder } = require('discord.js');
const getMemberRoles = require('../../utils/getMemberRoles');
const getLogChannel = require('../../utils/getLogChannel');

module.exports = async (client, oldMember, newMember) => {
  try {
    const channel = await getLogChannel(client, newMember.guild.id, 'member');
    if (!channel) return;

    const oldRoles = getMemberRoles(oldMember);
    const newRoles = getMemberRoles(newMember);
    const oldNickName = oldMember.nickname || 'no Nickname';
    const newNickName = newMember.nickname || 'no Nickname';
    const oldServerIcon = oldMember.avatarURL();
    const newServerIcon = newMember.avatarURL();
    let action, title, description, roles, thumbnail;
    let fields = [];
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
      if (oldNickName === 'no Nickname') {
        action = 'added';
      } else if (newNickName === 'no Nickname') {
        action = 'removed';
      } else {
        action = 'changed';
      }
      title = `Nickname ${action}`;
      fields.push({name: 'Before', value: oldNickName});
      fields.push({name: 'After', value: newNickName});
    } else if (oldServerIcon !== newServerIcon) {
      thumbnail = newServerIcon;
      if (!oldServerIcon) {
        action = 'added';
      } else if (!newServerIcon) {
        action = 'removed';
        thumbnail = null;
      } else {
        action = 'changed';
      }
      console.log(action);
      title = `Server Icon ${action}`;
      console.log(title);
    }
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
    } else if (fields.length > 0) {
      fields.forEach(field => {
        embed.addFields({
          name: field.name,
          value: field.value
        })
      });
    } else {
      embed.setThumbnail(thumbnail);
      embed.setDescription(`${newMember}`);
    }
    await channel.send({ embeds: [embed] })
  } catch (error) {
    console.error('Failed to log Member update!', error)
  }
}