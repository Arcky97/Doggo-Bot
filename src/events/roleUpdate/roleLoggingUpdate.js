const { Client, Role, EmbedBuilder, PermissionsBitField } = require('discord.js');
const getLogChannel = require('../../utils/logging/getLogChannel');
const setEventTimeOut = require('../../handlers/setEventTimeOut');
const categorizedPermissions = require('./../../../data/loggingPermissions.json');

module.exports = async (client, oldRole, newRole) => {
  try {
    
    const logChannel = await getLogChannel(client, oldRole.guild.id, 'server');
    if (!logChannel) return;

    let embed = new EmbedBuilder()
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
    
    await setEventTimeOut('role', newRole.id, embed, logChannel);

  } catch (error) {
    console.error('Failed to log Role Update!', error);
  }
}