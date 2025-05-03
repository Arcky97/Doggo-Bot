const { EmbedBuilder } = require("discord.js");
const { getGuildSettings } = require('../../managers/guildSettingsManager.js');
const { createErrorEmbed, createNotDMEmbed } = require("../../services/embeds/createReplyEmbed.js");
const createListFromArray = require("../../utils/createListFromArray.js");
const createMissingPermissionsEmbed = require("../../utils/createMissingPermissionsEmbed.js");
const { setBotStats } = require("../../managers/botStatsManager.js");

module.exports = {
  name: 'settings',
  description: 'Shows the settings of the bot.',
  callback: async (interaction) => {
    await interaction.deferReply();

    if (!interaction.inGuild()) return interaction.editReply({
      embeds: [createNotDMEmbed(interaction)]
    });

    let embed;
    const guildId = interaction.guild.id;

    try {
      const settings = await getGuildSettings(guildId);
      const ignoreLogging = JSON.parse(settings.ignoreLogging) || [];
      const joinRoles = JSON.parse(settings.joinRoles) || [];

      const permEmbed = await createMissingPermissionsEmbed(interaction, interaction.member, ['ManageGuild']);
      if (permEmbed) return interaction.editReply({ embeds: [permEmbed] });
      
      if (settings) {
        embed = new EmbedBuilder()
          .setColor('Aqua')
          .setTitle('Server Settings')
          .setFields(
            {
              name: '**Chatting**',
              value: `${settings.chattingChannel ? `<#${settings.chattingChannel}>` : 'Not set'}`,
              inline: true
            },
            {
              name: '**Message Logs**',
              value: `${settings.messageLogging ? `<#${settings.messageLogging}>` : 'Not set'}`,
              inline: true
            },
            {
              name: '**Memeber Logs**',
              value: `${settings.memberLogging ? `<#${settings.memberLogging}>` : 'Not set'}`,
              inline: true
            },
            {
              name: '**Server Logs**',
              value: `${settings.serverLogging ? `<#${settings.serverLogging}>` : 'Not set'}`,
              inline: true
            },
            {
              name: '**Voice Logs**',
              value: `${settings.voiceLogging ? `<#${settings.voiceLogging}>` : 'Not set'}`,
              inline: true
            },
            {
              name: '**Join/Leave Logs**',
              value: `${settings.joinLeaveLogging ? `<#${settings.joinLeaveLogging}>` : 'Not set'}`,
              inline: true
            },
            {
              name: '**Moderation Logging**',
              value: `${settings.moderationLogging ? `<#${settings.moderationLogging}>` : 'Not set'}`,
              inline: true
            },
            {
              name: '**Report Logging**',
              value: `${settings.reportLogging ? `<#${settings.reportLogging}>` : 'Not Set'}`,
              inline: true, 
            },
            {
              name: '**Ignore Logging**',
              value: `${ignoreLogging.length > 0 ? `${createListFromArray(ignoreLogging, '- <#${channelId}>', false)}` : 'None set.'}`,
              inline: true 
            },
            {
              name: '**Join Roles**',
              value: `${joinRoles.length > 0 ? `${createListFromArray(joinRoles, '- <@&${roleId}>', false)}` : 'None Set.'}`,
              inline: true 
            },
            {
              name: '**Mute Role**',
              value: `${settings.muteRole ? `<@&${settings.muteRole}>` : 'Not Set'}`,
              inline: true 
            }
          )
          .setTimestamp();
        } else {
          embed = new EmbedBuilder()
          .setColor('Aqua')
          .setTitle('Server Settings')
          .setDescription('No Settings available')
          .setTimestamp()
        }
        await setBotStats(guildId, 'command', { category: 'moderation', command: 'setting' });
    } catch (error) {
      console.error(`Error getting Settings for guild ${guildId}:`, error);
      embed = createErrorEmbed({ int: interaction, descr: 'Oh no, I couldn\'t retrieve the Settings for your Server. \nPlease try again later.'});
    }
    interaction.editReply({ embeds: [embed]});
  }
}