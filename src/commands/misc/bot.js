const { ApplicationCommandOptionType } = require("discord.js");
const { botStartTime } = require("../..");
const { createSuccessEmbed, createUnfinishedEmbed, createErrorEmbed } = require("../../utils/embeds/createReplyEmbed");
const formatTime = require("../../utils/formatTime");
const { setBotStats } = require("../../../database/BotStats/setBotStats");

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
      await setBotStats(interaction.guild.id, 'command', { category: 'misc', command: 'bot' });
    } catch (error) {
      console.error('There was an error with the bot command', error);

      embed = createErrorEmbed({
        int: interaction,
        descr: 'There was an error with the Bot Command. Please try again later.'
      });
    }
    await interaction.reply({ embeds: [embed] });
  }
}