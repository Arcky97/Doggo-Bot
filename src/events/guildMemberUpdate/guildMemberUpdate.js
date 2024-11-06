const { Client, GuildMember, EmbedBuilder } = require('discord.js');
const getMemberRoles = require('../../utils/getMemberRoles');
const getLogChannel = require('../../utils/getLogChannel');
const setEventTimeOut = require('../../handlers/setEventTimeOut');

const embedQueue = new Map();

module.exports = async (client, oldMember, newMember) => {
  try {
    if (client.user.id === oldMember.user.id) return;

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

    // Check for role changes
    if (oldRoles.length !== newRoles.length) {
      if (oldRoles.length < newRoles.length) {
        roles = newRoles.filter(role => !oldRoles.includes(role));
        action = 'added';
      } else {
        roles = oldRoles.filter(role => !newRoles.includes(role));
        action = 'removed';
      }
      const roleMentions = roles.map(roleId => `<@&${roleId}>`);
      title = `${roles.length > 1 ? 'Roles' : 'Role'} ${action}`;
      description = roleMentions.join(', ');
    } 
    // Check for nickname change
    else if (oldNickName !== newNickName) {
      action = oldNickName === 'no Nickname' ? 'added' : (newNickName === 'no Nickname' ? 'removed' : 'changed');
      title = `Nickname ${action}`;
      fields.push({ name: 'Before', value: oldNickName });
      fields.push({ name: 'After', value: newNickName });
    } 
    // Check for server icon change
    else if (oldServerIcon !== newServerIcon) {
      thumbnail = newServerIcon;
      action = !oldServerIcon ? 'added' : (!newServerIcon ? 'removed' : 'changed');
      title = `Server Icon ${action}`;
    }

    if (!title) return;

    // Create the embed
    const embed = new EmbedBuilder()
      .setColor('Blue')
      .setAuthor({
        name: newMember.user.globalName,
        iconURL: newMember.user.avatarURL()
      })
      .setTitle(title)
      .setTimestamp()
      .setFooter({ text: `User ID: ${newMember.user.id}` });

    if (roles) {
      embed.setDescription(description);
    } else if (fields.length > 0) {
      fields.forEach(field => embed.addFields(field));
    } else {
      embed.setThumbnail(thumbnail);
      embed.setDescription(`${newMember}`);
    }

    await setEventTimeOut('member', newMember.id, embed, channel);

  } catch (error) {
    console.error('Failed to log Member update!', error);
  }
};
