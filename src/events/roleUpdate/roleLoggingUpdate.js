const { Client, Role, EmbedBuilder, PermissionsBitField } = require('discord.js');
const getLogChannel = require('../../utils/getLogChannel');
const setEventTimeOut = require('../../handlers/setEventTimeOut');

module.exports = async (client, oldRole, newRole) => {
  try {
    
    const logChannel = await getLogChannel(client, oldRole.guild.id, 'server');
    if (!logChannel) return;

    let embed = new EmbedBuilder()
      .setColor('Orange')  
      .setTitle(`Role Updated: ${oldRole.name}`)

    let beforeSettings = afterSettings = beforePerms = afterPerms = '';
    if (oldRole.name !== newRole.name) {
      beforeSettings += `**Name:** ${oldRole.name}\n`;
      afterSettings += `**Name:** ${newRole.name}\n`;
    }

    if (oldRole.hexColor !== newRole.hexColor) {
      beforeSettings += `**Color:** ${oldRole.hexColor}\n`;
      afterSettings += `**Color:** ${newRole.hexColor}\n`;
    }

    if (oldRole.mentionable !== newRole.mentionable) {
      beforeSettings += `**Mentionable:** ${oldRole.mentionable}\n`;
      afterSettings += `**Mentionable:** ${newRole.mentionable}\n`;
    }

    if (oldRole.hoist !== newRole.hoist) {
      beforeSettings += `**Separated:** ${oldRole.hoist}\n`;
      afterSettings += `**Separated:** ${newRole.hoist}\n`;
    }

    const addedPermissions = newRole.permissions.bitfield & ~oldRole.permissions.bitfield;
    const removedPermissions = oldRole.permissions.bitfield & ~newRole.permissions.bitfield;

    const permissionFlags = Object.keys(PermissionsBitField.Flags);
    permissionFlags.forEach(flag => {
      const permission = PermissionsBitField.Flags[flag];

      if (addedPermissions & permission) {
        afterPerms += `+ **${flag}**\n`;
      }
      
      if (removedPermissions & permission) {
        beforePerms += `+ **${flag}**\n`;
      }
    });


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
    )

    if (beforePerms || afterPerms) {
      embed.addFields(
        {
          name: 'Permissions Removed',
          value: beforePerms || 'No changes'
        },
        {
          name: 'Permissions Added',
          value: afterPerms || 'No changes'
        }
      )
    }
    embed.setFooter({
      text: `Role ID: ${newRole.id}`
    })
    .setTimestamp()
    await setEventTimeOut('role', newRole.id, embed, logChannel);

    console.log(`The role ${newRole.name} with ID: ${oldRole.id} was updated in Server ${oldRole.guild.id}.`)

  } catch (error) {
    console.error('Failed to log Role Update!', error);
  }
}