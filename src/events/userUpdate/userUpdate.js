const { Client, User, EmbedBuilder } = require('discord.js');
const getLogChannel = require('../../managers/logging/getLogChannel');
const eventTimeoutHandler = require('../../handlers/eventTimeoutHandler');
const { setBotStats } = require('../../managers/botStatsManager');
const { getGuildLoggingConfig } = require('../../managers/guildSettingsManager');

module.exports = async (oldUser, newUser) => {
  try {
    // Loop through all guilds to find where the user exists

    for (const guild of client.guilds.cache.values()) {
      const member = await guild.members.fetch(newUser.id).catch(() => null);
      if (!member) continue; // Skip guilds where the user is not a member

      await setBotStats(guild.id, 'event', { event: 'userUpdate' });
      
      const logChannel = await getLogChannel(guild.id, 'member');
      if (!logChannel) continue;

      const configLogging = await getGuildLoggingConfig(guild.id, 'member');
      if (configLogging.length === 0) return;

      const oldUserName = oldUser.username || 'No Name';
      const newUserName = newUser.username || 'No Name';
      const oldGlobalName = oldUser.globalName || 'No Name';
      const newGlobalName = newUser.globalName || 'No Name';
      const oldUserIcon = oldUser.avatarURL();
      const newUserIcon = newUser.avatarURL();
      let action, title, thumbnail;
      let fields = [];
      
      if (oldUserIcon !== newUserIcon) {
        if (!configLogging.avatars.globals) return;
        thumbnail = newUserIcon;
        if (!oldUserIcon) {
          action = 'added';
        } else if (!newUserIcon) {
          action = 'removed';
          thumbnail = null;
        } else {
          action = 'changed';
        }
        title = `Profile Icon ${action}`;
      } else {
        let oldValue, newValue;
        if (oldUserName !== newUserName) {
          if (!configLogging.names.users) return;
          title = 'User Name Changed';
          oldValue = oldUserName;
          newValue = newUserName;
        } else if (oldGlobalName !== newGlobalName) {
          if (!configLogging.names.globals) return;
          title = 'Profile Name Changed';
          oldValue = oldGlobalName;
          newValue = newGlobalName;
        }
        fields.push({ name: 'Before', value: oldValue });
        fields.push({ name: 'After', value: newValue });
      }
      
      if (!title) continue;

      const embed = new EmbedBuilder()
        .setColor('Blue')
        .setAuthor({
          name: newUser.globalName,
          iconURL: newUser.avatarURL()
        })
        .setTitle(title)
        .setTimestamp()
        .setFooter({
          text: `User ID: ${newUser.id}`
        });

      if (title.includes('Name')) {
        fields.forEach(field => {
          embed.addFields({
            name: `${field.name}`,
            value: `${field.value}`
          });
        });
      } else {
        embed.setThumbnail(thumbnail);
        embed.setDescription(`${newUser}`);
      }

      //await channel.send({ embeds: [embed] });

      await eventTimeoutHandler('member', `${newUser.id + guild.id}`, embed, logChannel);
    }
  } catch (error) {
    console.error('Failed to log Member update!', error);
  }
};