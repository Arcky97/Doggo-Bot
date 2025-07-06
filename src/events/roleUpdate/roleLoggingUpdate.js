import { EmbedBuilder, PermissionsBitField } from 'discord.js';
import getLogChannel from '../../managers/logging/getLogChannel.js';
import eventTimeoutHandler from '../../handlers/eventTimeoutHandler.js';
import checkLogTypeConfig from '../../managers/logging/checkLogTypeConfig.js';
import { setBotStats } from '../../managers/botStatsManager.js';
import { findJsonFile } from '../../managers/jsonDataManager.js';

const categorizedPermissions = findJsonFile('loggingPermissions.json', 'data');

export default async (oldRole, newRole) => {
  const guildId = oldRole.guild.id;
  try {
    await setBotStats(guildId, 'event', { event: 'roleUpdate' });

    const logChannel = await getLogChannel(guildId, 'server');
    if (!logChannel) return;

    const configLogging = checkLogTypeConfig({ guildId: guildId, type: 'server', cat: 'roles', option: 'updates' });
    if (!configLogging) return;

    const embed = new EmbedBuilder()
      .setColor('Orange')  
      .setTitle(`Role Updated: ${oldRole.name}`)

    let beforeSettings = afterSettings = '';
    if (oldRole.name !== newRole.name) {
      beforeSettings += `**Name:** ${oldRole.name}\n`;
      afterSettings += `**Name:** ${newRole.name}\n`;
    }

    if (oldRole.hexColor !== newRole.hexColor) {
      beforeSettings += `**Color:** ${oldRole.hexColor}\n`;
      afterSettings += `**Color:** ${newRole.hexColor}\n`;
    }

    if (oldRole.mentionable !== newRole.mentionable) {
      beforeSettings += `**Mentionable:** ${oldRole.mentionable ? 'Yes' : 'No'}\n`;
      afterSettings += `**Mentionable:** ${newRole.mentionable ? 'Yes' : 'No'}\n`;
    }

    if (oldRole.hoist !== newRole.hoist) {
      beforeSettings += `**Separated:** ${oldRole.hoist ? 'Yes' : 'No'}\n`;
      afterSettings += `**Separated:** ${newRole.hoist ? 'Yes' : 'No'}\n`;
    }

    const addedPermsByCategory = {};
    const removedPermsByCategory = {};

    const addedPermissions = newRole.permissions.bitfield & ~oldRole.permissions.bitfield;
    const removedPermissions = oldRole.permissions.bitfield & ~newRole.permissions.bitfield;

    for (const [category, permissions] of Object.entries(categorizedPermissions)) {
      addedPermsByCategory[category] = [];
      removedPermsByCategory[category] = [];

      permissions.forEach(permissionObj => {
        const [permissionCode, description] = Object.entries(permissionObj)[0];
        const permissionFlag = PermissionsBitField.Flags[permissionCode];

        if (permissionFlag) {
          if (addedPermissions & BigInt(permissionFlag)) {
            addedPermsByCategory[category].push(`- **${description}**`);
          }
  
          if (removedPermissions & BigInt(permissionFlag)) {
            removedPermsByCategory[category].push(`- **${description}**`);
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
          value: afterSettings || 'who knows what',
          inline: true 
        }
      );
    }

    for (const category in categorizedPermissions) {
      const added = addedPermsByCategory[category].join('\n');
      const removed = removedPermsByCategory[category].join('\n');

      if (added || removed) {
        embed.addFields(
          {
            name: `${category}`,
            value: `${added ? '**Added:**\n' + added : ''}\n${removed ? '**Removed:**\n' + removed : ''}`
          }
        );
      }
    }
    embed.setFooter({
      text: `Role ID: ${newRole.id}`
    })
    .setTimestamp()

    if (oldRole.position !== newRole.position && embed.addFields.length < 1) return;
    
    await eventTimeoutHandler('role', newRole.id, embed, logChannel);

  } catch (error) {
    console.error('Failed to log Role Update!', error);
  }
}