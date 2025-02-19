const { ApplicationCommandOptionType } = require("discord.js");
const { getUserLevel, getAllUsersLevel } = require("../../../managers/levelSystemManager")
const { getXpSettings } = require("../../../managers/levelSettingsManager");
const levelColor = require("./subCommands/levelColor");
const levelLeaderboard = require("./subCommands/levelLeaderboard");
const levelShow = require("./subCommands/levelShow");
const createMissingPermissionsEmbed = require("../../../utils/createMissingPermissionsEmbed");
const { createErrorEmbed } = require("../../../services/embeds/createReplyEmbed");
const { setBotStats } = require("../../../managers/botStatsManager");

module.exports = {
  name: 'level',
  description: 'Various commands for the Level System',
  options: [
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'show',
      description: "Show your or another user's current level",
      options: [
        {
          type: ApplicationCommandOptionType.Mentionable,
          name: 'user',
          description: 'The user of who you want to show the level.'
        }
      ] 
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'color',
      description: 'Change the color of your rank card.',
      options : [
        {
          type: ApplicationCommandOptionType.String,
          name: 'color',
          description: 'Input color (color name (for ex. Orange), hex color (for ex. #f97316) or random)',
          required: true,
        }
      ]
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'leaderboard',
      description: 'Show the leaderboard for this Server.',
    }
  ],
  callback: async (interaction) => {
    const subCmnd = interaction.options.getSubcommand();
    const user = interaction.options.getMember('user') || interaction.user;

    let embed; 
    
    await interaction.deferReply();

    try {
      const userLevel = await getUserLevel(interaction.guild.id, user.id);
      const guildUsers = await getAllUsersLevel(interaction.guild.id);
      const xpSettings = await getXpSettings(interaction.guild.id);

      const permEmbed = await createMissingPermissionsEmbed(interaction, user, ['AttachFiles']);
      if (permEmbed) return interaction.editReply({ embeds: [permEmbed] });
      
      guildUsers.sort((a, b) => {
        if (a.level === b.level) {
          return b.xp - a.xp;
        } else {
          return b.level - a.level;
        }
      });
      switch (subCmnd) {
        case 'show':
          embed = await levelShow(interaction, userLevel, xpSettings, user, guildUsers);
          break;
        case 'color':
          embed = await levelColor(interaction, userLevel);
          break;
        case 'leaderboard':
          embed = await levelLeaderboard(interaction, guildUsers, xpSettings);
          break;
      }
      
      await setBotStats(interaction.guild.id, 'command', { category: 'misc', command: 'level' });
    } catch (error) {
      console.error('Error with the Level Command:', error);
      embed = createErrorEmbed({
        int: interaction,
        descr: 'There was an error with the Level Command. Please try again later.'
      });
    }
    if (embed) interaction.editReply({ embeds: [embed] });
  }
}