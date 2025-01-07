const { ApplicationCommandOptionType } = require("discord.js");
const { getPremiumById } = require("../../../database/PremiumUsersAndGuilds/setPremiumUsersAndGuilds");
const formatTime = require("../../utils/formatTime");
const { createSuccessEmbed, createInfoEmbed, createErrorEmbed } = require("../../utils/embeds/createReplyEmbed");

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
    const subCmd = interaction.options.getSubcommand();
    const isPremium = await getPremiumById(interaction.user.id);
    let embed;
    await interaction.deferReply();
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