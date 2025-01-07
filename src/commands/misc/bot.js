const { ApplicationCommandOptionType } = require("discord.js");
const { botStartTime } = require("../..");
const { createSuccessEmbed } = require("../../utils/embeds/createReplyEmbed");
const formatTime = require("../../utils/formatTime")

module.exports = {
  name: 'bot',
  description: 'Various Bot information commands',
  options: [
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'uptime',
      description: 'Shows how long the bot has been online since it was last restarted',
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'info',
      description: 'Shows information about Doggo Bot.'
    }
  ],
  callback: async (interaction) => {
    const subCmd = interaction.options.getSubcommand();
    const uptime = await formatTime(botStartTime, true);
    let embed;
    try {
      switch (subCmd) {
        case 'uptime':
          embed = createSuccessEmbed({ int: interaction, title: 'Doggo Bot Up Time', descr: `Doggo Bot has been online for ${uptime}.`});
          break;
        case 'info':
          embed = createUnfinishedEmbed(interaction);
          break;
      }
      
    } catch (error) {
      console.error('There was an error with the bot command', error);
    }
    await interaction.reply({ embeds: [embed] });
  }
}