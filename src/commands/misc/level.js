const { ApplicationCommandOptionType, AttachmentBuilder } = require("discord.js");
const { getAllUsersLevel, getUserLevel } = require("../../../database/levelSystem/setLevelSystem");
const calculateLevelXp = require("../../utils/calculateLevelXp");
const { Font, RankCardBuilder } = require("canvacord");

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
      name: 'leaderboard',
      description: 'Show the leaderboard for this Server.',
    }
  ],
  callback: async (client, interaction) => {
    await interaction.deferReply();

    const subCommand = interaction.options.getSubcommand();
    const mentionUserId = interaction.options.get('user')?.value;
    const targetUserId = mentionUserId || interaction.member.id;
    const targetUserObj = await interaction.guild.members.fetch(targetUserId);

    const userLevel = await getUserLevel(interaction.guild.id, targetUserId);

    if (!userLevel && subCommand === 'show') {
      interaction.editReply(
        mentionUserId ? `${targetUserObj.user.tag} doesn't have a level yet.` : "You don't have a level yet" 
      );
      return;
    }

    const guildUsers = await getAllUsersLevel(interaction.guild.id);

    guildUsers.sort((a, b) => {
      if (a.level === b.level) {
        return b.xp - a.xp;
      } else {
        return b.level - a.level;
      }
    });

    let currentRank = guildUsers.findIndex(lvl => lvl.memberId === targetUserId) + 1;
    Font.loadDefault();
    const rank = new RankCardBuilder()
      .setAvatar(targetUserObj.user.displayAvatarURL({ size: 256}))
      .setRank(currentRank)
      .setLevel(userLevel.level)
      .setCurrentXP(userLevel.xp)
      .setRequiredXP(calculateLevelXp(userLevel.level + 1))
      .setStatus(targetUserObj.presence?.status || 'offline')  // Fallback for status
      .setUsername(targetUserObj.user.username)

    try {
      const data = await rank.build();
      const attachment = new AttachmentBuilder(data);
      interaction.editReply({ files: [attachment] });
    } catch (error) {
      console.error("Error building rank card:", error);
      interaction.editReply("There was an error generating the rank card.");
    }
  }
}