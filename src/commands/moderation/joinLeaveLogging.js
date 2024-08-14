const { ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");
const { setGuildSettings } = require("../../../database/guildSettings/setGuildSettings");

module.exports = {
  name: 'setup-join-leave-logging',
  description: 'Setup the channel for join-leave Logging.',
  options: [
    {
      type: ApplicationCommandOptionType.Channel,
      name: 'channel',
      description: 'The channel for logging join-leave events.',
      required: true
    }
  ],
  permissionsRequired: [PermissionFlagsBits.Administrator],
  callback: async (client, interaction) => {
    const channel = interaction.options.get('channel').value;
    const guildID = interaction.guild.id;
    const response = await setGuildSettings(guildID, 'joinLeaveLogging', channel)
    await interaction.reply(response);
  }
};