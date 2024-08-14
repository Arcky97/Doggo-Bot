const { ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");
const { setGuildSettings } = require("../../../database/guildSettings/setGuildSettings");

module.exports = {
  name: 'setup-voice-logging',
  description: 'Setup the channel for voice Logging.',
  options: [
    {
      type: ApplicationCommandOptionType.Channel,
      name: 'channel',
      description: 'The channel for logging voice events.',
      required: true
    }
  ],
  permissionsRequired: [PermissionFlagsBits.Administrator],
  callback: async (client, interaction) => {
    const channel = interaction.options.get('channel').value;
    const guildID = interaction.guild.id;
    const response = await setGuildSettings(guildID, 'voiceLogging', channel);
    await interaction.reply(response);
  }
}