const { ApplicationCommandOptionType } = require("discord.js");
const { getUserLevel, getAllUsersLevel } = require("../../../../database/levelSystem/setLevelSystem")
const { getXpSettings } = require("../../../../database/levelSystem/setLevelSettings");
const levelColor = require("./subCommands/levelColor");
const levelLeaderboard = require("./subCommands/levelLeaderboard");
const levelShow = require("./subCommands/levelShow");

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
    await interaction.deferReply();
    const subCmnd = interaction.options.getSubcommand();
    const user = interaction.options.getMember('user') || interaction.user;
    const userLevel = await getUserLevel(interaction.guild.id, user.id);
    const guildUsers = await getAllUsersLevel(interaction.guild.id);
    const xpSettings = await getXpSettings(interaction.guild.id);
    guildUsers.sort((a, b) => {
      if (a.level === b.level) {
        return b.xp - a.xp;
      } else {
        return b.level - a.level;
      }
    });

    let embed; 

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
    if (embed) interaction.editReply({ embeds: [embed] });
  }
}