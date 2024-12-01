const { getGuildLoggingConfig, setGuildLoggingConfig } = require("../../../database/guildSettings/setGuildSettings");
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
          let configLogging = await getGuildLoggingConfig(guild.id, 'member');
          configLogging.bans.removes = true;
          delete configLogging.bans.deletes;
          configLogging.timeouts.removes = true;
          delete configLogging.timeouts.deletes;
          configLogging.avatars.globals = true;
          configLogging.avatars.servers = true;
          delete configLogging.avatars.global;
          delete configLogging.avatars.server;
          await setGuildLoggingConfig(guild.id, 'member', configLogging);
        }
        embed = createSuccessEmbed({ int: interaction, title: 'Fixed stuff in the Database!', descr: 'Stuff has been fixed in the Database for the GuildSettings Table.'});
      } catch (error) {
        embed = createErrorEmbed({int: interaction, description: 'Something went wrong fixing the Database! Try again later!'});
      }
    }
    await interaction.reply({ embeds: [embed] });
  }
}