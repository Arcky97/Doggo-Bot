import { ApplicationCommandOptionType } from "discord.js";
import { botStartTime } from "../../index.js";
import { createSuccessEmbed, createUnfinishedEmbed, createErrorEmbed } from "../../services/embeds/createReplyEmbed.js";
import formatTime from "../../utils/formatTime.js";
import { setBotStats } from "../../managers/botStatsManager.js";

export default {
  name: 'bot',
  description: 'Various Bot information commands',
  deleted: true,
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
      await setBotStats(interaction.guild?.id, 'command', { category: 'misc', command: 'bot' });
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