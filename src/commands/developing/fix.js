const { setBotStats } = require("../../../database/BotStats/setBotStats");
const exportToJson = require("../../handlers/exportToJson");
const { createSuccessEmbed, createErrorEmbed, createWarningEmbed } = require("../../utils/embeds/createReplyEmbed");

module.exports = {
  name: 'fix',
  description: 'fix some stuff in the database.',
  deleted: true,
  devOnly: true,
  callback: async (interaction) => {
    const guildId = interaction.guild.id;
    let embed;
    if (interaction.user.id === '763287145615982592') {
      embed = createWarningEmbed({
        int: interaction, 
        title: 'Bad Zeta!', 
        descr: `No ${interaction.user}! Don't try to fix what's broken!`
      });
    } else {
      try {
        const tables = ['BotReplies', 'EventEmbeds', 'GeneratedEmbeds', 'GuildSettings', 'LevelSettings', 'LevelSystem', 'ModerationLogs', 'PremiumUsersAndGuilds', 'ReactionRoles', 'UserStats'];
        for (const guild of client.guilds.cache.values()) {
          tables.forEach(async table => {
            exportToJson(table, guild.id);
          });
        }
        embed = createSuccessEmbed({ int: interaction, title: 'Database Tables Exported.', descr: 'Each Table from the Database has been exported by Guild Id to a json file.'});
      } catch (error) {
        embed = createErrorEmbed({int: interaction, description: 'Something went wrong fixing the Database! Try again later!'});
      }
    }
    await interaction.reply({ embeds: [embed] });
    await setBotStats(guildId, 'command', { category: 'developing', command: 'fix' });
  }
}