const { ApplicationCommandOptionType } = require("discord.js");
const { getPremiumById } = require("../../managers/premiumManager");
const formatTime = require("../../utils/formatTime");
const { createSuccessEmbed, createErrorEmbed, createNotDMEmbed } = require("../../services/embeds/createReplyEmbed");
const { setBotStats } = require("../../managers/botStatsManager");

module.exports = {
  name: 'membership',
  description: 'Check how long you have been a Premium User.',
  options: [
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'time',
      description: 'The Time you have been a Premium User.',
    }
  ],
  premiumOnly: true,
  callback: async (interaction) => {
    await interaction.deferReply();

    if (!interaction.inGuild()) return interaction.editReply({
      embeds: [createNotDMEmbed(interaction)]
    });

    let embed;
    const isPremium = await getPremiumById(interaction.user.id);
    const guildId = interaction.guild.id;

    try {
      if (isPremium) {
        const date = isPremium.date;
        const dateFormatted = date instanceof Date 
          ? date.toISOString().slice(0, 19).replace('T', ' ')
          : date;
        const uptime = await formatTime(dateFormatted, true);
        embed = createSuccessEmbed({
          int: interaction,
          title: 'Premium Member Time',
          descr: `You have been a Premium Member for ${uptime}!`
        })
      }

      await setBotStats(guildId, 'command', { category: 'premium', command: 'membership' });
    } catch (error) {
      console.error('There was an Error getting the Premium Time:', error);
      embed = createErrorEmbed({
        int: interaction,
        descr: 'There was an Error getting the Premium Time.'
      });
    }
    interaction.editReply({ embeds: [embed] });
  } 
};