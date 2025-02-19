const { Client, GuildMember, EmbedBuilder } = require('discord.js');
const getMemberRoles = require('../../managers/logging/getMemberRoles');
const getLogChannel = require('../../managers/logging/getLogChannel');
const eventTimeoutHandler = require('../../handlers/eventTimeoutHandler');
const { getGuildLoggingConfig } = require('../../managers/guildSettingsManager.js');
const { setBotStats } = require('../../managers/botStatsManager');

module.exports = async (oldMember, newMember) => {
  const guildId = oldMember.guild.id
  try {
    await setBotStats(guildId, 'event', { event: 'guildMemberUpdate' });

    if (client.user.id === oldMember.user.id) return;

    const logChannel = await getLogChannel(guildId, 'member');
    if (!logChannel) return;

    const configLogging = await getGuildLoggingConfig(guildId, 'member');
    if (configLogging.length === 0) return;

    const oldRoles = getMemberRoles(oldMember);
    const newRoles = getMemberRoles(newMember);
    const oldNickName = oldMember.nickname || 'no Nickname';
    const newNickName = newMember.nickname || 'no Nickname';
    const oldServerIcon = oldMember.avatarURL();
    const newServerIcon = newMember.avatarURL();
    const oldTimeout = oldMember.communicationDisabledUntilTimestamp;
    const newTimeout = newMember.communicationDisabledUntilTimestamp;
    let action, title, description, roles, thumbnail;
    let fields = [];

    // Check for role changes
    if (oldRoles.length !== newRoles.length) {
      if (oldRoles.length < newRoles.length) {
        if (!configLogging.roles.adds) return;
        roles = newRoles.filter(role => !oldRoles.includes(role));
        action = 'added';
      } else {
        if (!configLogging.roles.removes) return;
        roles = oldRoles.filter(role => !newRoles.includes(role));
        action = 'removed';
      }
      const roleMentions = roles.map(roleId => `<@&${roleId}>`);
      title = `${roles.length > 1 ? 'Roles' : 'Role'} ${action}`;
      description = roleMentions.join(', ');
    } 
    // Check for nickname change
    else if (oldNickName !== newNickName) {
      if (!configLogging.names.nicks) return;
      action = oldNickName === 'no Nickname' ? 'added' : (newNickName === 'no Nickname' ? 'removed' : 'changed');
      title = `Nickname ${action}`;
      fields.push({ name: 'Before', value: oldNickName });
      fields.push({ name: 'After', value: newNickName });
    } 
    // Check for server icon change
    else if (oldServerIcon !== newServerIcon) {
      if (!configLogging.avatars.servers) return;
      thumbnail = newServerIcon;
      action = !oldServerIcon ? 'added' : (!newServerIcon ? 'removed' : 'changed');
      title = `Server Icon ${action}`;
    }
    // Check for timeout change
    else if (oldTimeout !== newTimeout) {
      if (newTimeout) {
        if (!configLogging.timeouts.adds) return;
        action = 'added'
      } else {
        if (!configLogging.timeouts.removes) return;
        action = 'removed';
      }
      title = `Member Timeout ${action}`;
      fields.push({ name: 'Name', value: `${newMember.user}`});
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

    await eventTimeoutHandler('member', newMember.id, embed, logChannel);

  } catch (error) {
    console.error('Failed to log Member update!', error);
  }
};
