const { Client, GuildChannel, EmbedBuilder } = require('discord.js');
const getLogChannel = require("../../utils/logging/getLogChannel");
const setEventTimeOut = require("../../handlers/setEventTimeOut");
const getChannelTypeName = require('../../utils/logging/getChannelTypeName');
const convertNumberInTime = require('../../utils/convertNumberInTime');
const formatOverwrite = require('../../utils/permissions/formatOverwrite');
const comparePermissions = require('../../utils/permissions/comparePermissions');
const checkLogTypeConfig = require('../../utils/logging/checkLogTypeConfig');
const { setBotStats } = require('../../../database/BotStats/setBotStats');

module.exports = async (oldChannel, newChannel) => {
  const guildId = oldChannel.guild.id;
  try {
    await setBotStats(guildId, 'event', { event: 'channelUpdate' });

    const logChannel = await getLogChannel(guildId, 'server');
    if (!logChannel) return;

    const loggingConfig = await checkLogTypeConfig({guildId: guildId, type: 'server', cat: 'channels', option: 'updates'});
    if (!loggingConfig) return;

    let embed = new EmbedBuilder()
      .setColor('Orange')
      .setTitle(`${getChannelTypeName(oldChannel)} Update: ${oldChannel}`)

    let beforeSettings = afterSettings = '';
    if (oldChannel.name !== newChannel.name) {
      beforeSettings += `**Name:** ${oldChannel.name}\n`;
      afterSettings += `**Name:** ${newChannel.name}\n`;
    }

    if (oldChannel.parentId !== newChannel.parentId) {
      beforeSettings += `**Category:** ${oldChannel.parent?.name || 'None'}\n`;
      afterSettings += `**Category:** ${newChannel.parent?.name || 'None'}\n`;
    }

    if (oldChannel.topic !== newChannel.topic) {
      beforeSettings += `**Topic:** ${oldChannel.topic || 'None'}\n`;
      afterSettings += `**Topic:** ${newChannel.topic || 'None'}\n`;
    }

    if (oldChannel.nsfw !== newChannel.nsfw) {
      beforeSettings += `**Age-Restricted:** ${oldChannel.nsfw}\n`;
      afterSettings += `**Age-Restricted: ** ${newChannel.nsfw}\n`;
    }

    if (oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser) {
      beforeSettings += `**Slow Mode:** ${oldChannel.rateLimitPerUser > 1 ? convertNumberInTime(oldChannel.rateLimitPerUser, 'Seconds') : 'Off'}\n`;
      afterSettings += `**Slow Mode:** ${newChannel.rateLimitPerUser > 1 ? convertNumberInTime(newChannel.rateLimitPerUser, 'Seconds') : 'Off'}\n`;
    }

    if (oldChannel.defaultAutoArchiveDuration !== newChannel.defaultAutoArchiveDuration) {
      beforeSettings += `**Hide After Inactivity:** ${convertNumberInTime(oldChannel.defaultAutoArchiveDuration, 'Minutes')}\n`;
      afterSettings += `**Hide After Inactivity:** ${convertNumberInTime(newChannel.defaultAutoArchiveDuration, 'Minutes')}\n`;
    }

    if (beforeSettings !== '' || afterSettings !== '') {
      embed.addFields(
        {
          name: 'Before',
          value: beforeSettings || 'nothing',
          inline: true 
        },
        {
          name: 'After',
          value: afterSettings || 'Who knows what',
          inline: true 
        }
      );
    }

    const addedOverwrites = [];
    const removedOverwrites = [];
    const changedOverwrites = [];

    newChannel.permissionOverwrites.cache.forEach(newOverwrite => {
      const oldOverwrite = oldChannel.permissionOverwrites.cache.get(newOverwrite.id);

      if (!oldOverwrite) {
        addedOverwrites.push(`- ${formatOverwrite(newOverwrite, oldChannel.guild.id)}`);
      }

      const changes = comparePermissions(oldOverwrite, newOverwrite);
      if (changes) {
        changedOverwrites.push({
          id: newOverwrite.id,
          type: newOverwrite.type,
          changes 
        });
      }
    });

    oldChannel.permissionOverwrites.cache.forEach(oldOverwrite => {
      if (!newChannel.permissionOverwrites.cache.has(oldOverwrite.id)) {
        removedOverwrites.push(`- ${formatOverwrite(oldOverwrite, oldChannel.guild.id)}`);
      }
    });

    if (addedOverwrites.length > 0) {
      embed.addFields({
        name: 'Added Overwrites',
        value: addedOverwrites.join('\n') || 'None',
      });
    }

    if (removedOverwrites.length > 0) {
      embed.addFields({
        name: 'Removed Overwrites',
        value: removedOverwrites.join('\n') || 'None',
      });
    }

    const permissionFields = {};
    if (changedOverwrites.length > 0) {
      const filteredOverwrites = changedOverwrites.filter(change => 
        !Object.values(change.changes).every(perms => 
          perms.length === 0
        )
      );
      if (filteredOverwrites.length === 1) {
        const singleChange = filteredOverwrites[0];
        embed.setDescription(`Permission Overwrite${Object.values(singleChange.changes).some(value => value.length > 1) ? 's' : ''} Updated for ${formatOverwrite(singleChange, oldChannel.guild.id)}`);
      } else if (filteredOverwrites.length > 1) {
        embed.setDescription(`Permission Overwrites Updated`);
      }
      filteredOverwrites.forEach(change => {
        for (const [category, permissions] of Object.entries(change.changes)) {
          if (!permissionFields[category]) permissionFields[category] = [];
          permissionFields[category].push(`${formatOverwrite(change, oldChannel.guild.id)}`)
          permissionFields[category].push(permissions);
        }
      });
      for (const [category, rolePermissions] of Object.entries(permissionFields)) {
        let fieldValue = '';
        for (let i = 0; i < rolePermissions.length; i += 2) {
          const role = rolePermissions[i];
          const changes = rolePermissions[i + 1];

          if (changes.length > 0) {
            if (filteredOverwrites.length !== 1) fieldValue += `${role}\n`;
            changes.forEach(change => {
              fieldValue += `${change}\n`;
            });
          }
        }
        if (fieldValue !== '') {
          embed.addFields({
            name: category,
            value: fieldValue.trim() 
          });
        }
      }
    }

    embed.setFooter({
      text: `Channel ID: ${newChannel.id}`
    })
    .setTimestamp()

    if (!embed.data.fields) return;
    await setEventTimeOut('channel', newChannel.id, embed, logChannel);

  } catch (error) {
    console.error('Failed to log Channel Update!', error);
  }
}