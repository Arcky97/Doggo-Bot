import { Client, GuildChannel, EmbedBuilder } from 'discord.js';
import getLogChannel from "../../managers/logging/getLogChannel.js";
import eventTimeoutHandler from '../../handlers/eventTimeoutHandler.js';
import getChannelTypeName from '../../managers/logging/getChannelTypeName.js';
import formatOverwrite from '../../middleware/permissions/formatOverwrite.js';
import comparePermissions from '../../middleware/permissions/comparePermissions.js';
import checkLogTypeConfig from '../../managers/logging/checkLogTypeConfig.js';
import { setBotStats } from '../../managers/botStatsManager.js';

export default async (channel) => {
  const guildId = channel.guild.id;
  try {
    await setBotStats(guildId, 'event', { event: 'channelCreate' });

    const logChannel = await getLogChannel(guildId, 'server');
    if (!logChannel) return;

    const configLogging = await checkLogTypeConfig({ guildId: guildId, type: 'server', cat: 'channels', option: 'creates' });
    if (!configLogging) return;

    let embed = new EmbedBuilder()
      .setColor('Green')
      .setTitle(`${getChannelTypeName(channel)} Created`)
      .setFields(
        {
          name: 'Name',
          value: channel.name 
        },
        {
          name: 'Category',
          value: `${channel.parent?.name || 'None'}`
        }
      )
      .setFooter({
        text: `Channel ID: ${channel.id}`
      })
      .setTimestamp()

      const permissionChanges = [];
      const permissionFields = {};
  
      // If permissions are custom
      channel.permissionOverwrites.cache.forEach(overwrite => {
        const changes = comparePermissions(null, overwrite); // Compare against no permissions
        if (changes) {
          permissionChanges.push({ id: overwrite.id, type: overwrite.type, changes });
        }
      });
  
      // Process changes for roles/members
      if (permissionChanges.length > 0) {
        permissionChanges.forEach(change => {
          for (const [category, permissions] of Object.entries(change.changes)) {
            if (!permissionFields[category]) permissionFields[category] = [];
            permissionFields[category].push(`${formatOverwrite(change, guildId)}`);
            permissionFields[category].push(permissions);
          }
        });
  
        // Add changes to the embed
        for (const [category, rolePermissions] of Object.entries(permissionFields)) {
          let fieldValue = '';
          for (let i = 0; i < rolePermissions.length; i += 2) {
            const role = rolePermissions[i];
            const changes = rolePermissions[i + 1];
  
            if (changes.length > 0) {
              fieldValue += `${role}\n`;
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

    await eventTimeoutHandler('server', channel.id, embed, logChannel);

  } catch (error) {
    console.error('Failed to log Channel Create!', error);
  }
}