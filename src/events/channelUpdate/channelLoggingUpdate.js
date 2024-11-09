const { Client, GuildChannel, EmbedBuilder } = require('discord.js');
const getLogChannel = require("../../utils/getLogChannel");
const setEventTimeOut = require("../../handlers/setEventTimeOut");
const getChannelTypeName = require('../../utils/getChannelTypeName');
const convertNumberInTime = require('../../utils/convertNumberInTime');
const formatOverwrite = require('../../utils/permissions/formatOverwrite');
const comparePermissions = require('../../utils/permissions/comparePermissions');

module.exports = async (client, oldChannel, newChannel) => {
  try {
    
    const logChannel = await getLogChannel(client, oldChannel.guild.id, 'server');
    if (!logChannel) return;

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

    const addedOverwrites = [];
    const removedOverwrites = [];
    const changedOverwrites = [];

    newChannel.permissionOverwrites.cache.forEach(newOverwrite => {
      const oldOverwrite = oldChannel.permissionOverwrites.cache.get(newOverwrite.id);

      if (!oldOverwrite) {
        // New Overwrite added
        addedOverwrites.push(formatOverwrite(newOverwrite, 'Added'));
      } else {
        const changes = comparePermissions(oldOverwrite, newOverwrite);
        if (changes) {
          changedOverwrites.push({
            id: newOverwrite.id,
            type: newOverwrite.type,
            changes 
          });
        }
      }
    });

    oldChannel.permissionOverwrites.cache.forEach(oldOverwrite => {
      if (!newChannel.permissionOverwrites.cache.has(oldOverwrite.id)) {
        removedOverwrites.push(formatOverwrite(oldOverwrite, 'Removed'));
      }
    });

    if (addedOverwrites.length > 0) {
      embed.addFields({
        name: 'Added Overwrites',
        value: addedOverwrites.join('\n') || 'None',
        inline: true 
      });
    }

    if (removedOverwrites.length > 0) {
      embed.addFields({
        name: 'Removed Overwrites',
        value: removedOverwrites.join('\n') || 'None',
        inline: true 
      });
    }

    if (changedOverwrites.length > 0) {
      changedOverwrites.forEach(change => {
        const hasChanges = Object.values(change.changes).some(permissions => permissions.length > 0);
        if (!hasChanges) return; 
        embed.setDescription(`Overwrite Change - ${change.type === 'role' || change.id === oldChannel.guild.id ? `<@&${change.id}>` : `<@${change.id}>`}`);
        for (const [category, permissions] of Object.entries(change.changes)) {
          if (permissions.length > 0) {
            embed.addFields({
              name: category,
              value: permissions.join('\n'),
            });
          }
        }
      });
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
    
    embed.setFooter({
      text: `Channel ID: ${newChannel.id}`
    })
    .setTimestamp()
    await setEventTimeOut('channel', newChannel.id, embed, logChannel);

    console.log(`The Channel ${newChannel} with ID: ${newChannel.id} was updated in Server ${newChannel.guild.id}.`);

  } catch (error) {
    console.error('Failed to log Channel Update!', error);
  }
}