const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { getGuildSettings } = require('../../../database/guildSettings/setGuildSettings.js');
const createErrorEmbed = require("../../utils/createErrorEmbed.js");

module.exports = {
  name: 'settings',
  description: 'Shows the settings of the bot.',
  permissionsRequired: [PermissionFlagsBits.Administrator],
  callback: async (client, interaction) => {
    try {
      await interaction.deferReply();
      const settings = await getGuildSettings(interaction.guild.id);
      let embed;
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
        interaction.editReply({ embeds: [embed] })
    } catch (error) {
      console.error(`Error getting Settings for guild ${interaction.guild.id}:`, error);
      embed = createErrorEmbed(interaction, 'Oh no, I couldn\'t retrieve the Settings for your Server. \nPlease try again later.')
      interaction.editReply({ embeds: [embed]})
    }
  }
}