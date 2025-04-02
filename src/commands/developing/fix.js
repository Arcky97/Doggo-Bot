const { setBotStats } = require("../../managers/botStatsManager");
const { setGeneratedEmbed, setEventEmbed } = require("../../managers/embedDataManager");
const { setLevelSettings } = require("../../managers/levelSettingsManager");
const exportToJson = require("../../services/database/exportDataToJson");
const { selectData } = require("../../services/database/selectData");
const { createSuccessEmbed, createErrorEmbed, createWarningEmbed } = require("../../services/embeds/createReplyEmbed");

module.exports = {
  name: 'fix',
  description: 'fix some stuff in the database.',
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
        const [levelSystemData, generatedEmbedsData, eventEmbedsData] = await Promise.all([selectData('LevelSettings', {}, true), selectData('GeneratedEmbeds', {}, true), selectData('EventEmbeds', {}, true)]);
        for (const guild of client.guilds.cache.values()) {
          const guildLevelSystemData = levelSystemData.find(data => data.guildId === guild.id);
          if (guildLevelSystemData) {
            let announceDefaultMessage = JSON.parse(guildLevelSystemData.announceDefaultMessage);
            announceDefaultMessage = renameKeyPreserveOrder(announceDefaultMessage, "imageURL", "imageUrl");
            const setting = { 'announceDefaultMessage': JSON.stringify(announceDefaultMessage)}
            await setLevelSettings({ id: guild.id, setting});
            exportToJson('LevelSettings', guild.id);
          }
          
          const guildGeneratedEmbedsData = generatedEmbedsData.filter(data => data.guildId === guild.id);
          if (guildGeneratedEmbedsData) {
            for (const embedData of guildGeneratedEmbedsData) {
              const convertedData = {
                ...embedData,
                author: {
                      name: embedData.author,
                      url: embedData.authorUrl,
                      iconUrl: embedData.authorIconUrl
                    },
                footer: {
                        text: embedData.footer,
                        iconUrl: embedData.footerIconUrl
                      }
              };
              delete convertedData.authorUrl;
              delete convertedData.authorIconUrl;
              delete convertedData.footerIconUrl;
              embedData.author = JSON.stringify(convertedData.author);
              embedData.footer = JSON.stringify(convertedData.footer);
              delete embedData.guildId;
              const channelId = embedData.channelId;
              delete embedData.channelId;
              const messageId = embedData.messageId;
              delete embedData.messageId;
              await setGeneratedEmbed(guild.id, channelId, messageId, embedData);

            }
            exportToJson('GeneratedEmbeds', guild.id);
          }
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