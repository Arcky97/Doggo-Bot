const { EmbedBuilder } = require("discord.js");

module.exports = (interaction, levSettings, globalMult, roleMults, channelMults, levelRoles, blackListRoles, blackListChannels, annMess) => {
  let embed;

  let roleMultLength = JSON.parse(levSettings.roleMultipliers).length;
  let channelMultLength = JSON.parse(levSettings.channelMultipliers).length;
  let roleBlackListLength = JSON.parse(levSettings.blackListRoles).length;
  let channelBlackListLength = JSON.parse(levSettings.blackListChannels).length; 

  if(levSettings) {
    embed = new EmbedBuilder()
      .setColor('Orange')
      .setTitle('Level System Settings')
      .setDescription('All Settings set for this Server of the Level System are shown below.' +
        '\nUse `/levels multiplier settings` to view all Multipliers for this Server.' + 
        '\nUse `/levels role settings` to view all Level Roles for this Server.' +
        '\nUse `/levels blacklist settings` to view all blacklisted Roles and Channels for this Server.'
      )
      .setFields(
        {
          name: 'Global Multiplier',
          value: levSettings.globalMultiplier ? `\`${globalMult}%\`` : 'not set',
          inline: true
        },
        {
          name: 'Role Multipliers',
          value: roleMults !== 'none' ? `${roleMultLength} ${roleMultLength > 1 ? 'Roles' : 'Role'}` : roleMults,
          inline: true
        },
        {
          name: 'Channel Multipliers', 
          value: channelMults !== 'none' ? `${channelMultLength} ${channelMultLength > 1 ? 'Channels' : 'Channel'}` : channelMults,
          inline: true  
        },
        {
          name: 'Cooldown',
          value: `${levSettings.xpCooldown} seconds`,
          inline: true 
        },
        {
          name: 'Replace Roles',
          value: levSettings.roleReplace ? 'Replace' : 'Do not replace',
          inline: true
        },
        {
          name: 'Level Roles', 
          value: levelRoles,
          inline: true 
        },
        {
          name: 'Clear on Leave',
          value: levSettings.clearOnLeave ? 'Enabled' : 'Disabled',
          inline: true
        },
        {
          name: 'Black Listed Roles',
          value: blackListRoles !== 'none' ? `${roleBlackListLength} ${roleBlackListLength > 1 ? 'Roles' : 'Role'}` : blackListRoles,
          inline: true 
        },
        {
          name: 'Black Listed Channels',
          value: blackListChannels !== 'none' ? `${channelBlackListLength} ${channelBlackListLength > 1 ? 'Channels' : 'Channel'}` : blackListChannels,
          inline: true 
        },
        {
          name: 'Announcement Channel',
          value: levSettings.announceChannel !== 'not set' ? `<#${levSettings.announceChannel}>` : 'Not set',
          inline: true 
        },
        {
          name: 'Announcement Ping',
          value: levSettings.announcePing ? 'Ping' : 'Don\'t ping',
          inline: true 
        },
        {
          name: 'Announcement Message',
          value: annMess.length === 0 ? 'Default' : 'Custom set.', 
          inline: true 
        },
        { 
          name: 'Voice XP',
          value: levSettings.voiceEnable ? 'Enabled' : 'Disabled',
          inline: true 
        }
      )
      .setFooter(
        {
          text: interaction.guild.name,
          iconURL: interaction.guild.iconURL()
        }
      )
      .setTimestamp();
      if (levSettings.voiceEnable) {
        embed.addFields(
          {
            name: 'Voice Multiplier',
            value: `\`${levSettings.voiceMultiplier * 100}%\``,
            inline: true 
          },
          {
            name: 'Voice Cooldown',
            value: levSettings.voiceCooldown > 1 ? `${levSettings.voiceCooldown} Seconds` : `${levSettings.voiceCooldown} Second`,
            inline: true 
          }
        )
      }

    } else {
      embed = new EmbedBuilder()
        .setColor('Red')
        .setTitle('Level System Settings')
        .setDescription('No Settings available.')
        .setTimestamp()
    }
  return embed;
}