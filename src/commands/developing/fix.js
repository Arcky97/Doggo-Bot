const { setBotStats } = require("../../managers/botStatsManager");
const { setLevelSettings } = require("../../managers/levelSettingsManager");
const exportToJson = require("../../services/database/exportDataToJson");
const { selectData } = require("../../services/database/selectData");
const { updateData } = require("../../services/database/updateData");
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
/*          const guildLevelSystemData = levelSystemData.find(data => data.guildId === guild.id);
          if (guildLevelSystemData) {
            let announceDefaultMessage = JSON.parse(guildLevelSystemData.announceDefaultMessage);
            announceDefaultMessage = renameKeyPreserveOrder(announceDefaultMessage, "imageURL", "imageUrl");
            const setting = { 'announceDefaultMessage': JSON.stringify(announceDefaultMessage)}
            await setLevelSettings({ id: guild.id, setting});
            exportToJson('LevelSettings', guild.id);
          }*/
          
          const guildGeneratedEmbedsData = generatedEmbedsData.filter(data => data.guildId === guild.id);
          if (guildGeneratedEmbedsData) {
            const convertedData = {
              ...guildGeneratedEmbedsData,
              author: guildGeneratedEmbedsData.author || guildGeneratedEmbedsData.authorUrl || guildGeneratedEmbedsData.authorIconUrl
                ? {
                    name: guildGeneratedEmbedsData.author,
                    url: guildGeneratedEmbedsData.authorUrl,
                    iconUrl: guildGeneratedEmbedsData.authorIconUrl
                  }
                : null,
              footer: guildGeneratedEmbedsData.footer || guildGeneratedEmbedsData.footerIconUrl
                  ? {
                      text: guildGeneratedEmbedsData.footer,
                      iconUrl: guildGeneratedEmbedsData.footerIconUrl
                    }
                  : null 
            };

            delete convertedData.authorUrl;
            delete convertedData.authorIconUrl;
            delete convertedData.footerIconUrl;
            JSON.stringify(convertedData.author);
            JSON.stringify(convertedData.footer);
            console.log(convertedData)
            //await setGeneratedEmbed(guildId, channel.id, message.id, embedOptions);
          }

          const guildEventEmbedsData = eventEmbedsData.find(data => data.guildId === guild.id);
          if (guildEventEmbedsData) {

          }
          
        }
        embed = createSuccessEmbed({ 
          int: interaction, 
          title: 'Table Data Fixed', 
          descr: 'The following table data has been fixed successfully: \n- LevelSettings \n- GeneratedEmbeds \n- EventEmbeds'
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