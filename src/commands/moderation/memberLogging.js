const { ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");
const { setGuildSettings } = require("../../../database/guildSettings/setGuildSettings");

module.exports = {
  name: 'setup-member-logging',
  description: 'Setup the channel for member Logging.',
  options: [
    {
      type: ApplicationCommandOptionType.Channel,
      name: 'channel',
      description: 'The channel for logging member events',
      required: true 
    }
  ],
  permissionsRequired: [PermissionFlagsBits.Administrator],
  callback: async (client, interaction) => {
    const channel = interaction.options.get('channel').value;
    const guildID = interaction.guild.id;
    const response = await setGuildSettings(guildID, 'memberLogging', channel);
    await interaction.reply(response);
  }
};