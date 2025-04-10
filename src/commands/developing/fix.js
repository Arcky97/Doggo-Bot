const { setBotStats } = require("../../managers/botStatsManager");
const { setGeneratedEmbed, setEventEmbed } = require("../../managers/embedDataManager");
const { setLevelSettings } = require("../../managers/levelSettingsManager");
const exportToJson = require("../../services/database/exportDataToJson");
const { selectData } = require("../../services/database/selectData");
const { createSuccessEmbed, createErrorEmbed, createWarningEmbed } = require("../../services/embeds/createReplyEmbed");

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
        for (const guild of client.guilds.cache.values()) {

        }
        embed = createSuccessEmbed({ 
          int: interaction, 
          title: 'Table Data Fixed', 
          descr: 'The following table data has been fixed successfully: \n- LevelSettings \n- GeneratedEmbeds'
        });
      } catch (error) {
        embed = createErrorEmbed({int: interaction, descr: `Something went wrong fixing the Database! Try again later! ${error}`});
      }
    }
    await interaction.reply({ embeds: [embed] });
    await setBotStats(guildId, 'command', { category: 'developing', command: 'fix' });
  }
}

const renameKeyPreserveOrder = (obj, oldKey, newKey) => {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) =>
      key === oldKey ? [newKey, value] : [key, value]
    )
  );
};