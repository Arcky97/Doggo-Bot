const { getRoleOrChannelMultipliers, setLevelSettings } = require("../../../database/levelSystem/setLevelSettings");
const { createSuccessEmbed, createErrorEmbed, createWarningEmbed } = require("../../utils/embeds/createReplyEmbed");

module.exports = {
  name: 'fix',
  description: 'fix some stuff in the database.',
  devOnly: true,
  callback: async (client, interaction) => {
    let embed;
    if (interaction.user.id === '763287145615982592') {
      embed = createWarningEmbed({int: interaction, title: 'Bad Zeta!', descr: `No ${interaction.user}! Don't try to fix what's broken!`});
    } else {
      try {
        for (const guild of client.guilds.cache.values()) {
          console.log(guild.name);
          let chanMults = await getRoleOrChannelMultipliers({ id: guild.id, type: 'channel'});
          let catMults = await getRoleOrChannelMultipliers({ id: guild.id, type: 'category'});
          
          for (const channel of chanMults) {
            if (channel.replace === undefined) {
              channel.replace = true;
            }
          }
          for (const category of catMults) {
            if (category.replace === undefined) {
              category.replace = true;
            }
          }
          await setLevelSettings({ id: guild.id, setting: { 'channelMultipliers': JSON.stringify(chanMults) } });
          await setLevelSettings({ id: guild.id, setting: { 'categoryMultipliers': JSON.stringify(catMults) }});
        }
        embed = createSuccessEmbed({ int: interaction, title: 'Fixed stuff in the Database!', descr: 'Stuff has been fixed in the Database for the LevelSettings Table.'});
      } catch (error) {
        embed = createErrorEmbed({int: interaction, description: 'Something went wrong fixing the Database! Try again later!'});
      }
    }
    await interaction.reply({ embeds: [embed] });
  }
}